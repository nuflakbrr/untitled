package domain

import "time"

type Status string

const (
	StatusWaiting  Status = "WAITING"
	StatusPaid     Status = "PAID"
	StatusFailed   Status = "FAILED"
	StatusRefunded Status = "REFUNDED"
)

const (
	ProviderIPaymu = "IPAYMU"
	ProviderManual = "MANUAL"
)

const (
	MethodQRIS   = "QRIS"
	MethodVA     = "VA"
	MethodManual = "MANUAL"
)

type Payment struct {
	ID             string
	RegistrationID string
	Amount         int64
	Status         Status
	Provider       string
	TransactionID  string
	PaymentMethod  string
	PaymentChannel string
	PaymentURL     string
	ProofURL       string
	ExpiredAt      *time.Time
	VerifiedAt     *time.Time
	VerifiedByID   *string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

// Gateway mirrors a tenant's payment gateway configuration
// (tenant_payment_gateways) used to route checkout to the correct
// iPaymu account or manual bank account for that faculty.
type Gateway struct {
	ID                string
	TenantID          string
	Provider          string
	IsActive          bool
	APIKey            string
	VirtualAccount    string
	Env               string
	BankName          string
	BankAccountNumber string
	BankAccountHolder string
}
