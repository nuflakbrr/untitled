package service

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"venturo-skeleton-go/internal/modules/features/payment/domain"
	"venturo-skeleton-go/internal/modules/features/payment/dto"
	"venturo-skeleton-go/internal/modules/features/payment/repository"
	"venturo-skeleton-go/pkg/ipaymu"
)

var ErrForbidden = errors.New("not allowed to act on this payment")

// IpaymuClient is the subset of *ipaymu.Client the service depends on, so
// tests can substitute a fake gateway without hitting the network.
type IpaymuClient interface {
	CreatePayment(ctx context.Context, req ipaymu.CreatePaymentRequest) (*ipaymu.CreatePaymentData, error)
	CheckTransaction(ctx context.Context, transactionID string) (*ipaymu.TransactionStatus, error)
}

// ClientFactory builds a gateway client scoped to ONE tenant's own
// credentials. It is called fresh for every checkout/webhook so a request
// for a Fasilkom event can never end up using Rektorat's (or any other
// faculty's) api_key/virtual_account.
type ClientFactory func(env, virtualAccount, apiKey string) IpaymuClient

type Repository interface {
	GetRegistrationForCheckout(ctx context.Context, registrationID string) (*repository.RegistrationForCheckout, error)
	GetActiveGateway(ctx context.Context, tenantID string) (*domain.Gateway, error)
	ClaimPendingPayment(ctx context.Context, registrationID, provider string, amount int64) (*domain.Payment, string, error)
	CompleteCheckout(ctx context.Context, id, checkoutToken, transactionID, paymentURL, method, channel string) error
	ReleaseCheckout(ctx context.Context, id, checkoutToken string) error
	GetByRegistrationID(ctx context.Context, registrationID string) (*domain.Payment, error)
	GetGatewayByTransactionID(ctx context.Context, transactionID string) (*domain.Payment, *domain.Gateway, error)
	MarkPaid(ctx context.Context, paymentID string, verifiedByID *string, method, channel string) error
	MarkFailed(ctx context.Context, paymentID string, verifiedByID *string) error
	SubmitProof(ctx context.Context, paymentID, userID, proofURL string) error
	VerifyProofScope(ctx context.Context, paymentID string, scopeTenantID *string) error
}

type PaymentService struct {
	repository    Repository
	newClient     ClientFactory
	publicBaseURL string
	frontendURL   string
}

func NewPaymentService(repo *repository.PaymentRepository, publicBaseURL string, httpTimeoutSeconds int) *PaymentService {
	timeout := time.Duration(httpTimeoutSeconds) * time.Second
	factory := func(env, va, apiKey string) IpaymuClient {
		return ipaymu.NewClient(env, va, apiKey, timeout)
	}
	return NewPaymentServiceWithInterfaces(repo, factory, publicBaseURL, os.Getenv("FRONTEND_URL"))
}

func NewPaymentServiceWithInterfaces(repo Repository, factory ClientFactory, publicBaseURL, frontendURL string) *PaymentService {
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}
	return &PaymentService{repository: repo, newClient: factory, publicBaseURL: publicBaseURL, frontendURL: frontendURL}
}

// Checkout opens (or resumes) a payment for a registration the caller owns.
// The tenant that organizes the event is resolved strictly from the
// registration's own event, so the gateway credentials used — and therefore
// where the money settles — always belong to that one tenant.
func (s *PaymentService) Checkout(ctx context.Context, userID string, req dto.CheckoutRequest) (*dto.PaymentResponse, error) {
	reg, err := s.repository.GetRegistrationForCheckout(ctx, req.RegistrationID)
	if err != nil {
		return nil, err
	}
	if reg.UserID != userID {
		return nil, repository.ErrRegistrationNotFound
	}
	if reg.Status == "REGISTERED" || reg.Status == "CHECKED_IN" {
		return nil, repository.ErrAlreadyPaid
	}
	if reg.Status != "WAITING_PAYMENT" {
		return nil, repository.ErrNotPayable
	}

	gateway, err := s.repository.GetActiveGateway(ctx, reg.TenantID)
	if err != nil {
		return nil, err
	}

	payment, checkoutToken, err := s.repository.ClaimPendingPayment(ctx, req.RegistrationID, gateway.Provider, reg.Amount)
	if err != nil {
		return nil, err
	}
	if checkoutToken == "" {
		response := toResponse(payment)
		return &response, nil
	}

	if gateway.Provider == domain.ProviderManual {
		if err := s.repository.ReleaseCheckout(ctx, payment.ID, checkoutToken); err != nil {
			return nil, err
		}
		response := toResponse(payment)
		response.Provider = domain.ProviderManual
		response.BankName = gateway.BankName
		response.BankAccountNumber = gateway.BankAccountNumber
		response.BankAccountHolder = gateway.BankAccountHolder
		return &response, nil
	}

	client := s.newClient(gateway.Env, gateway.VirtualAccount, gateway.APIKey)
	created, err := client.CreatePayment(ctx, ipaymu.CreatePaymentRequest{
		Product:     []string{"Event Registration"},
		Qty:         []int{1},
		Price:       []int64{reg.Amount},
		ReturnURL:   strings.TrimRight(s.frontendURL, "/") + "/registration/success/" + req.RegistrationID,
		CancelURL:   strings.TrimRight(s.frontendURL, "/") + "/participant/dashboard",
		NotifyURL:   strings.TrimRight(s.publicBaseURL, "/") + "/features/v1/payments/webhook/ipaymu",
		ReferenceID: payment.ID,
	})
	if err != nil {
		if releaseErr := s.repository.ReleaseCheckout(ctx, payment.ID, checkoutToken); releaseErr != nil {
			return nil, errors.Join(fmt.Errorf("open ipaymu checkout: %w", err), releaseErr)
		}
		return nil, fmt.Errorf("open ipaymu checkout: %w", err)
	}
	if err := s.repository.CompleteCheckout(ctx, payment.ID, checkoutToken, created.TransactionID, created.URL, "", ""); err != nil {
		if releaseErr := s.repository.ReleaseCheckout(context.WithoutCancel(ctx), payment.ID, checkoutToken); releaseErr != nil {
			return nil, errors.Join(err, releaseErr)
		}
		return nil, err
	}
	payment.TransactionID = created.TransactionID
	payment.PaymentURL = created.URL
	response := toResponse(payment)
	return &response, nil
}

// HandleWebhook never trusts the callback body beyond using its trx_id as a
// lookup key: the real status is re-fetched from iPaymu using the SAME
// tenant's own credentials before anything in the database changes.
func (s *PaymentService) HandleWebhook(ctx context.Context, payload dto.WebhookPayload) error {
	if payload.TransactionID == "" {
		return nil
	}
	payment, gateway, err := s.repository.GetGatewayByTransactionID(ctx, payload.TransactionID)
	if errors.Is(err, repository.ErrPaymentNotFound) && payload.ReferenceID != "" {
		payment, gateway, err = s.repository.GetGatewayByTransactionID(ctx, payload.ReferenceID)
	}
	if errors.Is(err, repository.ErrPaymentNotFound) {
		return nil // unknown transaction — ignore rather than leak/500-loop
	}
	if err != nil {
		return err
	}
	if payment.Status != domain.StatusWaiting {
		return nil // already settled — idempotent no-op
	}

	client := s.newClient(gateway.Env, gateway.VirtualAccount, gateway.APIKey)
	status, err := client.CheckTransaction(ctx, payload.TransactionID)
	if err != nil {
		return fmt.Errorf("verify ipaymu transaction: %w", err)
	}

	switch {
	case status.EffectiveStatus() > 0:
		// iPaymu may report a successful payment held in escrow as status 7.
		// It is already paid from the participant's perspective; settlement
		// status is handled by iPaymu separately.
		return s.repository.MarkPaid(ctx, payment.ID, nil, strings.ToUpper(status.Via), strings.ToUpper(status.Channel))
	case status.Status < 0:
		return s.repository.MarkFailed(ctx, payment.ID, nil)
	default:
		return nil // still pending
	}
}

func (s *PaymentService) SubmitProof(ctx context.Context, userID, paymentID string, req dto.SubmitProofRequest) error {
	return s.repository.SubmitProof(ctx, paymentID, userID, req.ProofURL)
}

func (s *PaymentService) VerifyProof(ctx context.Context, scopeTenantID *string, approverID, paymentID string, req dto.VerifyProofRequest) error {
	if err := s.repository.VerifyProofScope(ctx, paymentID, scopeTenantID); err != nil {
		return err
	}
	if req.Approve {
		return s.repository.MarkPaid(ctx, paymentID, &approverID, domain.MethodManual, "")
	}
	return s.repository.MarkFailed(ctx, paymentID, &approverID)
}

// GetByRegistration only returns the payment to the registration's own
// owner, to a root superadmin, or to an organizer whose own tenant matches
// the event's tenant. Anyone else gets ErrPaymentNotFound (not 403), so the
// response never confirms whether a given registration exists.
func (s *PaymentService) GetByRegistration(ctx context.Context, callerUserID, callerTenantID string, callerIsSuperAdmin bool, registrationID string) (*dto.PaymentResponse, error) {
	reg, err := s.repository.GetRegistrationForCheckout(ctx, registrationID)
	if err != nil {
		return nil, err
	}
	isOwner := reg.UserID == callerUserID
	isOrganizerInScope := callerTenantID != "" && callerTenantID == reg.TenantID
	if !isOwner && !callerIsSuperAdmin && !isOrganizerInScope {
		return nil, repository.ErrPaymentNotFound
	}

	payment, err := s.repository.GetByRegistrationID(ctx, registrationID)
	if err != nil {
		return nil, err
	}
	response := toResponse(payment)
	return &response, nil
}

func toResponse(payment *domain.Payment) dto.PaymentResponse {
	return dto.PaymentResponse{
		ID: payment.ID, RegistrationID: payment.RegistrationID, Amount: payment.Amount,
		Status: string(payment.Status), Provider: payment.Provider, TransactionID: payment.TransactionID,
		PaymentMethod: payment.PaymentMethod, PaymentChannel: payment.PaymentChannel,
		PaymentURL: payment.PaymentURL, ProofURL: payment.ProofURL, ExpiredAt: payment.ExpiredAt,
		VerifiedAt: payment.VerifiedAt, CreatedAt: payment.CreatedAt, UpdatedAt: payment.UpdatedAt,
	}
}
