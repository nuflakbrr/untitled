package service

import (
	"context"
	"errors"
	"sync"
	"testing"

	"venturo-skeleton-go/internal/modules/features/payment/domain"
	"venturo-skeleton-go/internal/modules/features/payment/dto"
	"venturo-skeleton-go/internal/modules/features/payment/repository"
	"venturo-skeleton-go/pkg/ipaymu"
)

type fakeRepo struct {
	mu            sync.Mutex
	registrations map[string]*repository.RegistrationForCheckout
	gateways      map[string]*domain.Gateway
	payments      map[string]*domain.Payment
	byTxn         map[string]string // transactionID -> paymentID

	verifyScopeErr error
	markPaidCalls  []markPaidCall
	markFailedIDs  []string
	checkoutClaims map[string]string
}

type markPaidCall struct {
	paymentID string
	method    string
	channel   string
}

func newFakeRepo() *fakeRepo {
	return &fakeRepo{
		registrations:  map[string]*repository.RegistrationForCheckout{},
		gateways:       map[string]*domain.Gateway{},
		payments:       map[string]*domain.Payment{},
		byTxn:          map[string]string{},
		checkoutClaims: map[string]string{},
	}
}

func (f *fakeRepo) GetRegistrationForCheckout(_ context.Context, registrationID string) (*repository.RegistrationForCheckout, error) {
	reg, ok := f.registrations[registrationID]
	if !ok {
		return nil, repository.ErrRegistrationNotFound
	}
	return reg, nil
}

func (f *fakeRepo) GetActiveGateway(_ context.Context, tenantID string) (*domain.Gateway, error) {
	gw, ok := f.gateways[tenantID]
	if !ok {
		return nil, repository.ErrGatewayNotConfigured
	}
	return gw, nil
}

func (f *fakeRepo) ClaimPendingPayment(_ context.Context, registrationID, provider string, amount int64) (*domain.Payment, string, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if existing, ok := f.payments[registrationID]; ok {
		if existing.Status != domain.StatusWaiting {
			return nil, "", repository.ErrAlreadyPaid
		}
		if existing.TransactionID != "" && existing.PaymentURL != "" {
			return existing, "", nil
		}
		if f.checkoutClaims[existing.ID] != "" {
			return nil, "", repository.ErrCheckoutInProgress
		}
		existing.Provider = provider
		token := "claim-" + existing.ID
		f.checkoutClaims[existing.ID] = token
		return existing, token, nil
	}
	payment := &domain.Payment{ID: "pay-" + registrationID, RegistrationID: registrationID, Amount: amount, Status: domain.StatusWaiting, Provider: provider}
	f.payments[registrationID] = payment
	token := "claim-" + payment.ID
	f.checkoutClaims[payment.ID] = token
	return payment, token, nil
}

func (f *fakeRepo) CompleteCheckout(_ context.Context, id, checkoutToken, transactionID, paymentURL, method, channel string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.checkoutClaims[id] != checkoutToken {
		return repository.ErrPaymentNotFound
	}
	for _, p := range f.payments {
		if p.ID == id {
			p.TransactionID = transactionID
			p.PaymentURL = paymentURL
			f.byTxn[transactionID] = p.ID
			delete(f.checkoutClaims, id)
			return nil
		}
	}
	return repository.ErrPaymentNotFound
}

func (f *fakeRepo) ReleaseCheckout(_ context.Context, id, checkoutToken string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.checkoutClaims[id] == checkoutToken {
		delete(f.checkoutClaims, id)
	}
	return nil
}

func (f *fakeRepo) GetByRegistrationID(_ context.Context, registrationID string) (*domain.Payment, error) {
	p, ok := f.payments[registrationID]
	if !ok {
		return nil, repository.ErrPaymentNotFound
	}
	return p, nil
}

func (f *fakeRepo) GetGatewayByTransactionID(_ context.Context, transactionID string) (*domain.Payment, *domain.Gateway, error) {
	paymentID, ok := f.byTxn[transactionID]
	if !ok {
		return nil, nil, repository.ErrPaymentNotFound
	}
	for _, p := range f.payments {
		if p.ID == paymentID {
			for _, gw := range f.gateways {
				return p, gw, nil // single-tenant fixtures in tests below
			}
		}
	}
	return nil, nil, repository.ErrPaymentNotFound
}

func (f *fakeRepo) MarkPaid(_ context.Context, paymentID string, _ *string, method, channel string) error {
	f.markPaidCalls = append(f.markPaidCalls, markPaidCall{paymentID, method, channel})
	for _, p := range f.payments {
		if p.ID == paymentID {
			p.Status = domain.StatusPaid
			return nil
		}
	}
	return nil
}

func (f *fakeRepo) MarkFailed(_ context.Context, paymentID string, _ *string) error {
	f.markFailedIDs = append(f.markFailedIDs, paymentID)
	for _, p := range f.payments {
		if p.ID == paymentID {
			p.Status = domain.StatusFailed
			return nil
		}
	}
	return nil
}

func (f *fakeRepo) SubmitProof(_ context.Context, paymentID, userID, proofURL string) error {
	for _, p := range f.payments {
		if p.ID == paymentID {
			p.ProofURL = proofURL
			return nil
		}
	}
	return repository.ErrPaymentNotFound
}

func (f *fakeRepo) VerifyProofScope(_ context.Context, _ string, _ *string) error {
	return f.verifyScopeErr
}

// fakeClient records which credentials it was constructed with, so tests can
// assert a tenant's checkout never uses another tenant's api_key/va.
type fakeClient struct {
	env, va, apiKey string
	createResp      *ipaymu.CreatePaymentData
	createErr       error
	createFn        func(context.Context, ipaymu.CreatePaymentRequest) (*ipaymu.CreatePaymentData, error)
	statusResp      *ipaymu.TransactionStatus
	statusErr       error
}

func (c *fakeClient) CreatePayment(ctx context.Context, req ipaymu.CreatePaymentRequest) (*ipaymu.CreatePaymentData, error) {
	if c.createFn != nil {
		return c.createFn(ctx, req)
	}
	return c.createResp, c.createErr
}

func (c *fakeClient) CheckTransaction(context.Context, string) (*ipaymu.TransactionStatus, error) {
	return c.statusResp, c.statusErr
}

func TestCheckout_TenantIsolation_UsesOnlyThatTenantsCredentials(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-fasilkom"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-fasilkom", Amount: 50000, Status: "WAITING_PAYMENT"}
	repo.registrations["reg-teknik"] = &repository.RegistrationForCheckout{UserID: "user-2", TenantID: "tenant-teknik", Amount: 75000, Status: "WAITING_PAYMENT"}
	repo.gateways["tenant-fasilkom"] = &domain.Gateway{TenantID: "tenant-fasilkom", Provider: domain.ProviderIPaymu, Env: "sandbox", VirtualAccount: "va-fasilkom", APIKey: "key-fasilkom"}
	repo.gateways["tenant-teknik"] = &domain.Gateway{TenantID: "tenant-teknik", Provider: domain.ProviderIPaymu, Env: "sandbox", VirtualAccount: "va-teknik", APIKey: "key-teknik"}

	var builtClients []*fakeClient
	factory := func(env, va, apiKey string) IpaymuClient {
		c := &fakeClient{env: env, va: va, apiKey: apiKey, createResp: &ipaymu.CreatePaymentData{TransactionID: "trx-" + va, URL: "https://sandbox.ipaymu.com/" + va}}
		builtClients = append(builtClients, c)
		return c
	}
	svc := NewPaymentServiceWithInterfaces(repo, factory, "http://backend.local", "http://frontend.local")

	if _, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-fasilkom"}); err != nil {
		t.Fatalf("fasilkom checkout: %v", err)
	}
	if _, err := svc.Checkout(context.Background(), "user-2", dto.CheckoutRequest{RegistrationID: "reg-teknik"}); err != nil {
		t.Fatalf("teknik checkout: %v", err)
	}

	if len(builtClients) != 2 {
		t.Fatalf("expected 2 gateway clients built, got %d", len(builtClients))
	}
	if builtClients[0].apiKey != "key-fasilkom" || builtClients[0].va != "va-fasilkom" {
		t.Fatalf("fasilkom checkout used wrong credentials: %+v", builtClients[0])
	}
	if builtClients[1].apiKey != "key-teknik" || builtClients[1].va != "va-teknik" {
		t.Fatalf("teknik checkout used wrong credentials: %+v", builtClients[1])
	}
	if builtClients[0].apiKey == builtClients[1].apiKey {
		t.Fatal("two different tenants must never share an api key")
	}
}

func TestCheckout_RejectsNonOwner(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "owner", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "http://backend.local", "")

	_, err := svc.Checkout(context.Background(), "intruder", dto.CheckoutRequest{RegistrationID: "reg-1"})
	if !errors.Is(err, repository.ErrRegistrationNotFound) {
		t.Fatalf("expected ErrRegistrationNotFound for non-owner, got %v", err)
	}
}

func TestCheckout_AlreadyRegisteredIsRejected(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-1", Amount: 10000, Status: "REGISTERED"}
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "http://backend.local", "")

	_, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-1"})
	if !errors.Is(err, repository.ErrAlreadyPaid) {
		t.Fatalf("expected ErrAlreadyPaid, got %v", err)
	}
}

func TestCheckout_ManualProviderSkipsGatewayCall(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-reg-1", RegistrationID: "reg-1", Amount: 7500, Status: domain.StatusWaiting, Provider: domain.ProviderManual}
	repo.gateways["tenant-1"] = &domain.Gateway{TenantID: "tenant-1", Provider: domain.ProviderManual, BankName: "Bank Mandiri", BankAccountNumber: "12345", BankAccountHolder: "Fakultas Ilmu Komputer"}

	called := false
	factory := func(env, va, apiKey string) IpaymuClient { called = true; return &fakeClient{} }
	svc := NewPaymentServiceWithInterfaces(repo, factory, "http://backend.local", "")

	resp, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-1"})
	if err != nil {
		t.Fatalf("manual checkout: %v", err)
	}
	if called {
		t.Fatal("MANUAL provider must never call the iPaymu gateway")
	}
	if resp.BankAccountNumber != "12345" || resp.Provider != domain.ProviderManual || resp.Amount != 7500 {
		t.Fatalf("unexpected manual checkout response: %+v", resp)
	}
}

func TestCheckout_ConcurrentRequestDoesNotCreateSecondGatewaySession(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.gateways["tenant-1"] = &domain.Gateway{TenantID: "tenant-1", Provider: domain.ProviderIPaymu}

	started := make(chan struct{})
	release := make(chan struct{})
	client := &fakeClient{createFn: func(context.Context, ipaymu.CreatePaymentRequest) (*ipaymu.CreatePaymentData, error) {
		close(started)
		<-release
		return &ipaymu.CreatePaymentData{TransactionID: "trx-1", URL: "https://checkout.example/trx-1"}, nil
	}}
	svc := NewPaymentServiceWithInterfaces(repo, func(string, string, string) IpaymuClient { return client }, "", "")

	firstDone := make(chan error, 1)
	go func() {
		_, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-1"})
		firstDone <- err
	}()
	<-started

	_, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-1"})
	if !errors.Is(err, repository.ErrCheckoutInProgress) {
		t.Fatalf("second checkout error = %v, want ErrCheckoutInProgress", err)
	}
	close(release)
	if err := <-firstDone; err != nil {
		t.Fatalf("first checkout: %v", err)
	}
}

func TestCheckout_ReleasesClaimAfterGatewayFailure(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.gateways["tenant-1"] = &domain.Gateway{TenantID: "tenant-1", Provider: domain.ProviderIPaymu}
	gatewayErr := errors.New("gateway unavailable")
	svc := NewPaymentServiceWithInterfaces(repo, func(string, string, string) IpaymuClient {
		return &fakeClient{createErr: gatewayErr}
	}, "", "")

	for attempt := 0; attempt < 2; attempt++ {
		_, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-1"})
		if !errors.Is(err, gatewayErr) {
			t.Fatalf("attempt %d error = %v, want gateway error", attempt+1, err)
		}
	}
}

func TestCheckout_ResumesExistingGatewaySession(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1", Amount: 10000, Status: domain.StatusWaiting, Provider: domain.ProviderIPaymu, TransactionID: "trx-1", PaymentURL: "https://checkout.example/trx-1"}
	repo.gateways["tenant-1"] = &domain.Gateway{TenantID: "tenant-1", Provider: domain.ProviderIPaymu}
	called := false
	svc := NewPaymentServiceWithInterfaces(repo, func(string, string, string) IpaymuClient {
		called = true
		return &fakeClient{}
	}, "", "")

	response, err := svc.Checkout(context.Background(), "user-1", dto.CheckoutRequest{RegistrationID: "reg-1"})
	if err != nil || called || response.TransactionID != "trx-1" {
		t.Fatalf("response = %+v, gateway called = %v, error = %v", response, called, err)
	}
}

func TestHandleWebhook_ReVerifiesBeforeMarkingPaid(t *testing.T) {
	repo := newFakeRepo()
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1", Status: domain.StatusWaiting, TransactionID: "trx-1"}
	repo.byTxn["trx-1"] = "pay-1"
	repo.gateways["tenant-1"] = &domain.Gateway{TenantID: "tenant-1", VirtualAccount: "va-1", APIKey: "key-1"}

	checkCalled := false
	factory := func(env, va, apiKey string) IpaymuClient {
		return &fakeClient{statusResp: &ipaymu.TransactionStatus{Status: 1, Via: "qris", Channel: "qris"}}
	}
	svc := NewPaymentServiceWithInterfaces(repo, func(e, v, a string) IpaymuClient { checkCalled = true; return factory(e, v, a) }, "", "")

	if err := svc.HandleWebhook(context.Background(), dto.WebhookPayload{TransactionID: "trx-1"}); err != nil {
		t.Fatalf("HandleWebhook: %v", err)
	}
	if !checkCalled {
		t.Fatal("webhook must call CheckTransaction to re-verify before trusting the callback body")
	}
	if len(repo.markPaidCalls) != 1 || repo.markPaidCalls[0].method != "QRIS" {
		t.Fatalf("expected exactly one MarkPaid(QRIS) call, got %+v", repo.markPaidCalls)
	}
}

func TestHandleWebhook_UnknownTransactionIsIgnored(t *testing.T) {
	repo := newFakeRepo()
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "", "")

	if err := svc.HandleWebhook(context.Background(), dto.WebhookPayload{TransactionID: "does-not-exist"}); err != nil {
		t.Fatalf("expected nil error for unknown transaction, got %v", err)
	}
	if len(repo.markPaidCalls) != 0 {
		t.Fatal("unknown transaction must not mark anything paid")
	}
}

func TestHandleWebhook_IdempotentOnAlreadyPaid(t *testing.T) {
	repo := newFakeRepo()
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1", Status: domain.StatusPaid, TransactionID: "trx-1"}
	repo.byTxn["trx-1"] = "pay-1"
	repo.gateways["tenant-1"] = &domain.Gateway{TenantID: "tenant-1"}

	called := false
	factory := func(env, va, apiKey string) IpaymuClient { called = true; return &fakeClient{} }
	svc := NewPaymentServiceWithInterfaces(repo, factory, "", "")

	if err := svc.HandleWebhook(context.Background(), dto.WebhookPayload{TransactionID: "trx-1"}); err != nil {
		t.Fatalf("HandleWebhook: %v", err)
	}
	if called {
		t.Fatal("a webhook retry for an already-PAID payment must not call iPaymu again")
	}
}

func TestVerifyProof_ApproveAndReject(t *testing.T) {
	repo := newFakeRepo()
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1", Status: domain.StatusWaiting}
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "", "")

	if err := svc.VerifyProof(context.Background(), nil, "approver-1", "pay-1", dto.VerifyProofRequest{Approve: true}); err != nil {
		t.Fatalf("approve: %v", err)
	}
	if len(repo.markPaidCalls) != 1 {
		t.Fatalf("expected 1 MarkPaid call, got %d", len(repo.markPaidCalls))
	}

	repo2 := newFakeRepo()
	repo2.payments["reg-2"] = &domain.Payment{ID: "pay-2", RegistrationID: "reg-2", Status: domain.StatusWaiting}
	svc2 := NewPaymentServiceWithInterfaces(repo2, noopFactory, "", "")
	if err := svc2.VerifyProof(context.Background(), nil, "approver-1", "pay-2", dto.VerifyProofRequest{Approve: false}); err != nil {
		t.Fatalf("reject: %v", err)
	}
	if len(repo2.markFailedIDs) != 1 {
		t.Fatalf("expected 1 MarkFailed call, got %d", len(repo2.markFailedIDs))
	}
}

func TestVerifyProof_OutOfScopeIsRejected(t *testing.T) {
	repo := newFakeRepo()
	repo.verifyScopeErr = repository.ErrPaymentNotFound
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "", "")

	err := svc.VerifyProof(context.Background(), strPtr("other-tenant"), "approver-1", "pay-1", dto.VerifyProofRequest{Approve: true})
	if !errors.Is(err, repository.ErrPaymentNotFound) {
		t.Fatalf("expected ErrPaymentNotFound for out-of-scope verify, got %v", err)
	}
	if len(repo.markPaidCalls) != 0 {
		t.Fatal("out-of-scope verify must not mark anything paid")
	}
}

func TestGetByRegistration_OwnerCanView(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "user-1", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1"}
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "", "")

	if _, err := svc.GetByRegistration(context.Background(), "user-1", "", false, "reg-1"); err != nil {
		t.Fatalf("owner should be able to view their own payment: %v", err)
	}
}

func TestGetByRegistration_StrangerIsRejected(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "owner", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1"}
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "", "")

	_, err := svc.GetByRegistration(context.Background(), "intruder", "", false, "reg-1")
	if !errors.Is(err, repository.ErrPaymentNotFound) {
		t.Fatalf("a stranger with no tenant match must not see someone else's payment (IDOR), got %v", err)
	}

	_, err = svc.GetByRegistration(context.Background(), "intruder", "other-tenant", false, "reg-1")
	if !errors.Is(err, repository.ErrPaymentNotFound) {
		t.Fatalf("an organizer from a DIFFERENT tenant must not see this payment, got %v", err)
	}
}

func TestGetByRegistration_OrganizerInScopeOrSuperAdminCanView(t *testing.T) {
	repo := newFakeRepo()
	repo.registrations["reg-1"] = &repository.RegistrationForCheckout{UserID: "owner", TenantID: "tenant-1", Amount: 10000, Status: "WAITING_PAYMENT"}
	repo.payments["reg-1"] = &domain.Payment{ID: "pay-1", RegistrationID: "reg-1"}
	svc := NewPaymentServiceWithInterfaces(repo, noopFactory, "", "")

	if _, err := svc.GetByRegistration(context.Background(), "panitia-1", "tenant-1", false, "reg-1"); err != nil {
		t.Fatalf("organizer in the same tenant should be able to view: %v", err)
	}
	if _, err := svc.GetByRegistration(context.Background(), "root-1", "", true, "reg-1"); err != nil {
		t.Fatalf("root superadmin should be able to view: %v", err)
	}
}

func noopFactory(string, string, string) IpaymuClient { return &fakeClient{} }

func strPtr(s string) *string { return &s }
