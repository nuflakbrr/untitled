package dto

type CheckoutRequest struct {
	RegistrationID string `json:"registration_id" binding:"required,uuid4"`
}

type SubmitProofRequest struct {
	ProofURL string `json:"proof_url" binding:"required,url"`
}

type VerifyProofRequest struct {
	Approve bool   `json:"approve"`
	Note    string `json:"note" binding:"omitempty,max=500"`
}

// WebhookPayload is intentionally minimal: the service uses trx_id only as a
// lookup key and calls Client.CheckTransaction for authoritative status before
// mutating anything.
type WebhookPayload struct {
	TransactionID string `form:"trx_id" json:"trx_id"`
	ReferenceID   string `form:"reference_id" json:"reference_id"`
	StatusCode    string `form:"status_code" json:"status_code"`
}
