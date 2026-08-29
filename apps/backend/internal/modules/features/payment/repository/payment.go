package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/payment/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRegistrationNotFound = errors.New("registration not found")
	ErrNotPayable           = errors.New("registration is not awaiting payment")
	ErrAlreadyPaid          = errors.New("payment has already been completed")
	ErrGatewayNotConfigured = errors.New("tenant payment gateway is not configured")
	ErrPaymentNotFound      = errors.New("payment not found")
	ErrCheckoutInProgress   = errors.New("payment checkout is already being created")
)

const paymentColumns = `
	id, registration_id, amount, status::text, provider, COALESCE(transaction_id, ''),
	COALESCE(payment_method, ''), COALESCE(payment_channel, ''), COALESCE(payment_url, ''),
	COALESCE(proof_url, ''), expired_at, verified_at, verified_by_id, created_at, updated_at`

type PaymentRepository struct {
	db *pgxpool.Pool
}

func NewPaymentRepository(db *pgxpool.Pool) *PaymentRepository {
	return &PaymentRepository{db: db}
}

// RegistrationForCheckout is the minimal registration/event data needed to
// open a checkout session for it.
type RegistrationForCheckout struct {
	UserID   string
	TenantID string
	Amount   int64
	Status   string
}

func (r *PaymentRepository) GetRegistrationForCheckout(ctx context.Context, registrationID string) (*RegistrationForCheckout, error) {
	reg := &RegistrationForCheckout{}
	err := r.db.QueryRow(ctx, `
		SELECT r.user_id, e.tenant_id, COALESCE(p.amount, e.price), r.status::text
		FROM registrations r
		JOIN events e ON e.id = r.event_id
		LEFT JOIN payments p ON p.registration_id = r.id AND p.deleted_at IS NULL
		WHERE r.id = $1 AND r.deleted_at IS NULL
	`, registrationID).Scan(&reg.UserID, &reg.TenantID, &reg.Amount, &reg.Status)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrRegistrationNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get registration for checkout: %w", err)
	}
	return reg, nil
}

func (r *PaymentRepository) GetActiveGateway(ctx context.Context, tenantID string) (*domain.Gateway, error) {
	gateway := &domain.Gateway{}
	err := r.db.QueryRow(ctx, `
		SELECT id, tenant_id, provider, is_active, COALESCE(api_key, ''), COALESCE(virtual_account, ''),
		       env, COALESCE(bank_name, ''), COALESCE(bank_account_number, ''), COALESCE(bank_account_holder, '')
		FROM tenant_payment_gateways
		WHERE tenant_id = $1 AND is_active = TRUE
	`, tenantID).Scan(
		&gateway.ID, &gateway.TenantID, &gateway.Provider, &gateway.IsActive, &gateway.APIKey,
		&gateway.VirtualAccount, &gateway.Env, &gateway.BankName, &gateway.BankAccountNumber, &gateway.BankAccountHolder,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrGatewayNotConfigured
	}
	if err != nil {
		return nil, fmt.Errorf("get tenant gateway: %w", err)
	}
	return gateway, nil
}

// ClaimPendingPayment atomically reserves one checkout attempt. A recent
// claim prevents parallel requests from creating multiple gateway sessions;
// stale claims can be recovered after a crashed or timed-out request.
func (r *PaymentRepository) ClaimPendingPayment(ctx context.Context, registrationID, provider string, amount int64) (*domain.Payment, string, error) {
	checkoutToken := uuid.NewString()
	row := r.db.QueryRow(ctx, `
		WITH active_registration AS (
			SELECT id FROM registrations
			WHERE id = $2 AND status = 'WAITING_PAYMENT' AND deleted_at IS NULL
			FOR UPDATE
		)
		INSERT INTO payments (id, registration_id, amount, status, provider, checkout_token, checkout_claimed_at)
		SELECT $1, $2, $3, 'WAITING', $4, $5, NOW()
		FROM active_registration
		ON CONFLICT (registration_id) DO UPDATE
			SET provider = EXCLUDED.provider, checkout_token = EXCLUDED.checkout_token,
			    checkout_claimed_at = NOW(), updated_at = NOW()
			WHERE payments.status = 'WAITING'
			  AND payments.transaction_id IS NULL
			  AND (payments.checkout_token IS NULL OR payments.checkout_claimed_at < NOW() - INTERVAL '5 minutes')
		RETURNING `+paymentColumns, uuid.NewString(), registrationID, amount, provider, checkoutToken)
	payment, err := scanPayment(row)
	if errors.Is(err, pgx.ErrNoRows) {
		registration, registrationErr := r.GetRegistrationForCheckout(ctx, registrationID)
		if registrationErr != nil {
			return nil, "", registrationErr
		}
		if registration.Status != "WAITING_PAYMENT" {
			return nil, "", ErrNotPayable
		}
		existing, findErr := r.GetByRegistrationID(ctx, registrationID)
		if findErr != nil {
			return nil, "", findErr
		}
		if existing.Status != domain.StatusWaiting {
			return nil, "", ErrAlreadyPaid
		}
		if existing.TransactionID != "" && existing.PaymentURL != "" {
			return existing, "", nil
		}
		return nil, "", ErrCheckoutInProgress
	}
	if err != nil {
		return nil, "", fmt.Errorf("claim pending payment: %w", err)
	}
	return payment, checkoutToken, nil
}

func (r *PaymentRepository) CompleteCheckout(ctx context.Context, id, checkoutToken, transactionID, paymentURL, method, channel string) error {
	tag, err := r.db.Exec(ctx, `
		UPDATE payments
		SET transaction_id = $3, payment_url = $4, payment_method = $5, payment_channel = $6,
		    checkout_token = NULL, checkout_claimed_at = NULL, updated_at = NOW()
		WHERE id = $1 AND checkout_token = $2 AND status = 'WAITING'
	`, id, checkoutToken, transactionID, paymentURL, method, channel)
	if err != nil {
		return fmt.Errorf("update payment after gateway response: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrPaymentNotFound
	}
	return nil
}

func (r *PaymentRepository) ReleaseCheckout(ctx context.Context, id, checkoutToken string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE payments SET checkout_token = NULL, checkout_claimed_at = NULL, updated_at = NOW()
		WHERE id = $1 AND checkout_token = $2 AND status = 'WAITING'
	`, id, checkoutToken)
	if err != nil {
		return fmt.Errorf("release payment checkout: %w", err)
	}
	return nil
}

func (r *PaymentRepository) GetByTransactionID(ctx context.Context, transactionID string) (*domain.Payment, error) {
	row := r.db.QueryRow(ctx, `SELECT `+paymentColumns+` FROM payments WHERE transaction_id = $1`, transactionID)
	payment, err := scanPayment(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrPaymentNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get payment by transaction id: %w", err)
	}
	return payment, nil
}

// GetGatewayByTransactionID resolves the organizing tenant's own gateway
// credentials for a payment, strictly via registration -> event -> tenant_id.
// This is what guarantees a webhook re-verification (and any settlement) is
// always checked against the SAME tenant that owns the event — money for a
// Fasilkom event can never be verified/settled using another faculty's
// iPaymu credentials.
func (r *PaymentRepository) GetGatewayByTransactionID(ctx context.Context, transactionID string) (*domain.Payment, *domain.Gateway, error) {
	payment := &domain.Payment{}
	gateway := &domain.Gateway{}
	var status string
	err := r.db.QueryRow(ctx, `
		SELECT p.id, p.registration_id, p.amount, p.status::text, p.provider, COALESCE(p.transaction_id, ''),
		       COALESCE(p.payment_method, ''), COALESCE(p.payment_channel, ''), COALESCE(p.payment_url, ''),
		       COALESCE(p.proof_url, ''), p.expired_at, p.verified_at, p.verified_by_id, p.created_at, p.updated_at,
		       g.id, g.tenant_id, g.provider, g.is_active, COALESCE(g.api_key, ''), COALESCE(g.virtual_account, ''), g.env
		FROM payments p
		JOIN registrations r ON r.id = p.registration_id
		JOIN events e ON e.id = r.event_id
		JOIN tenant_payment_gateways g ON g.tenant_id = e.tenant_id
		WHERE p.transaction_id = $1 OR p.id = $1
	`, transactionID).Scan(
		&payment.ID, &payment.RegistrationID, &payment.Amount, &status, &payment.Provider, &payment.TransactionID,
		&payment.PaymentMethod, &payment.PaymentChannel, &payment.PaymentURL, &payment.ProofURL,
		&payment.ExpiredAt, &payment.VerifiedAt, &payment.VerifiedByID, &payment.CreatedAt, &payment.UpdatedAt,
		&gateway.ID, &gateway.TenantID, &gateway.Provider, &gateway.IsActive, &gateway.APIKey, &gateway.VirtualAccount, &gateway.Env,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil, ErrPaymentNotFound
	}
	if err != nil {
		return nil, nil, fmt.Errorf("get gateway by transaction id: %w", err)
	}
	payment.Status = domain.Status(status)
	return payment, gateway, nil
}

func (r *PaymentRepository) GetByRegistrationID(ctx context.Context, registrationID string) (*domain.Payment, error) {
	row := r.db.QueryRow(ctx, `SELECT `+paymentColumns+` FROM payments WHERE registration_id = $1`, registrationID)
	payment, err := scanPayment(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrPaymentNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get payment by registration id: %w", err)
	}
	return payment, nil
}

// MarkPaid atomically flips payments.status -> PAID and
// registrations.status -> REGISTERED. The WHERE status = 'WAITING' guard
// makes it safe to call more than once for the same payment (webhook
// retries, or a webhook racing a manual verification). method/channel may be
// empty to leave the existing values untouched.
func (r *PaymentRepository) MarkPaid(ctx context.Context, paymentID string, verifiedByID *string, method, channel string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin mark paid: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var registrationID, paymentStatus string
	err = tx.QueryRow(ctx, `SELECT registration_id, status::text FROM payments WHERE id = $1 FOR UPDATE`, paymentID).Scan(&registrationID, &paymentStatus)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrPaymentNotFound
	}
	if err != nil {
		return fmt.Errorf("lock payment for settlement: %w", err)
	}
	if paymentStatus == string(domain.StatusPaid) {
		return nil
	}
	if paymentStatus != string(domain.StatusWaiting) {
		return ErrNotPayable
	}

	tag, err := tx.Exec(ctx, `
		UPDATE registrations SET status = 'REGISTERED', updated_at = NOW()
		WHERE id = $1 AND status = 'WAITING_PAYMENT'
	`, registrationID)
	if err != nil {
		return fmt.Errorf("activate registration after payment: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotPayable
	}
	if _, err := tx.Exec(ctx, `
		UPDATE payments
		SET status = 'PAID', verified_at = NOW(), verified_by_id = $2, updated_at = NOW(),
		    payment_method = CASE WHEN $3 <> '' THEN $3 ELSE payment_method END,
		    payment_channel = CASE WHEN $4 <> '' THEN $4 ELSE payment_channel END,
		    checkout_token = NULL, checkout_claimed_at = NULL
		WHERE id = $1 AND status = 'WAITING'
	`, paymentID, verifiedByID, method, channel); err != nil {
		return fmt.Errorf("mark payment paid: %w", err)
	}
	return tx.Commit(ctx)
}

func (r *PaymentRepository) MarkFailed(ctx context.Context, paymentID string, verifiedByID *string) error {
	tag, err := r.db.Exec(ctx, `
		UPDATE payments
		SET status = 'FAILED', verified_at = NOW(), verified_by_id = $2, updated_at = NOW()
		WHERE id = $1 AND status = 'WAITING'
	`, paymentID, verifiedByID)
	if err != nil {
		return fmt.Errorf("mark payment failed: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrPaymentNotFound
	}
	return nil
}

// SubmitProof attaches manual-transfer proof to a payment, scoped to the
// registration owner so a participant cannot upload proof for someone else.
func (r *PaymentRepository) SubmitProof(ctx context.Context, paymentID, userID, proofURL string) error {
	tag, err := r.db.Exec(ctx, `
		UPDATE payments p
		SET proof_url = $3, updated_at = NOW()
		FROM registrations r
		WHERE p.id = $1 AND p.registration_id = r.id AND r.user_id = $2
		  AND p.status = 'WAITING' AND p.provider = 'MANUAL'
	`, paymentID, userID, proofURL)
	if err != nil {
		return fmt.Errorf("submit payment proof: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrPaymentNotFound
	}
	return nil
}

// VerifyProofScope validates the caller (panitia/superadmin) may act on this
// payment before the service decides to approve or reject it. scopeTenantID
// nil means the caller is a root superadmin with no tenant restriction.
func (r *PaymentRepository) VerifyProofScope(ctx context.Context, paymentID string, scopeTenantID *string) error {
	conditions := "p.id = $1 AND p.provider = 'MANUAL' AND p.status = 'WAITING' AND p.proof_url IS NOT NULL"
	args := []any{paymentID}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		conditions += " AND e.tenant_id = $2"
	}
	var exists bool
	query := `
		SELECT EXISTS(
			SELECT 1 FROM payments p
			JOIN registrations r ON r.id = p.registration_id
			JOIN events e ON e.id = r.event_id
			WHERE ` + conditions + `
		)`
	if err := r.db.QueryRow(ctx, query, args...).Scan(&exists); err != nil {
		return fmt.Errorf("check verify proof scope: %w", err)
	}
	if !exists {
		return ErrPaymentNotFound
	}
	return nil
}

func scanPayment(row pgx.Row) (*domain.Payment, error) {
	payment := &domain.Payment{}
	var status string
	if err := row.Scan(
		&payment.ID, &payment.RegistrationID, &payment.Amount, &status, &payment.Provider,
		&payment.TransactionID, &payment.PaymentMethod, &payment.PaymentChannel, &payment.PaymentURL,
		&payment.ProofURL, &payment.ExpiredAt, &payment.VerifiedAt, &payment.VerifiedByID,
		&payment.CreatedAt, &payment.UpdatedAt,
	); err != nil {
		return nil, err
	}
	payment.Status = domain.Status(status)
	return payment, nil
}
