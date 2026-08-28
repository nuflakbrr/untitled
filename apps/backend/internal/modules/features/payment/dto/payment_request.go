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

// WebhookPayload is intentionally loose: iPaymu's notifyUrl callback is
// form-encoded and unsigned, so the raw trx_id is only a lookup key — the
// service must call Client.CheckTransaction to get the trustworthy status
// before mutating anything.
type WebhookPayload struct {
	TransactionID string `form:"trx_id"`
	ReferenceID   string `form:"reference_id"`
	StatusCode    string `form:"status_code"`
}
