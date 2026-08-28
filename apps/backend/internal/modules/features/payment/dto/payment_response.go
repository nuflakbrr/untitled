package dto

import "time"

type PaymentResponse struct {
	ID             string `json:"id"`
	RegistrationID string `json:"registration_id"`
	Amount         int64  `json:"amount"`
	Status         string `json:"status"`
	Provider       string `json:"provider"`
	TransactionID  string `json:"transaction_id,omitempty"`
	PaymentMethod  string `json:"payment_method,omitempty"`
	PaymentChannel string `json:"payment_channel,omitempty"`
	PaymentURL     string `json:"payment_url,omitempty"`
	ProofURL       string `json:"proof_url,omitempty"`
	// Bank* fields are only populated for MANUAL provider payments, telling
	// the participant which faculty bank account to transfer to.
	BankName          string     `json:"bank_name,omitempty"`
	BankAccountNumber string     `json:"bank_account_number,omitempty"`
	BankAccountHolder string     `json:"bank_account_holder,omitempty"`
	ExpiredAt         *time.Time `json:"expired_at,omitempty"`
	VerifiedAt        *time.Time `json:"verified_at,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}
