package email

import (
	"crypto/tls"
	"fmt"
	"os"
	"strconv"
	"time"

	"venturo-skeleton-go/pkg/logger"

	"gopkg.in/gomail.v2"
)

// SMTPConfig holds SMTP configuration
type SMTPConfig struct {
	Host         string
	Port         int
	Username     string
	Password     string
	FromEmail    string
	FromName     string
	FrontendURL  string
	VerifyURL    string
	ResetURL     string
	SupportEmail string
}

// SMTPEmailService implements EmailService using SMTP
type SMTPEmailService struct {
	config *SMTPConfig
}

func (s *SMTPEmailService) layoutData(name string) EmailData {
	return EmailData{
		Name:          name,
		RecipientName: name,
		ShowIcon:      true,
		AppName:       "SITIVENT",
		AppURL:        s.config.FrontendURL,
		SupportEmail:  s.config.SupportEmail,
		SupportURL:    s.config.FrontendURL + "/help",
		Year:          time.Now().Year(),
	}
}

// NewSMTPEmailService creates a new SMTP email service
func NewSMTPEmailService() (*SMTPEmailService, error) {
	port, err := strconv.Atoi(getEnv("SMTP_PORT", "587"))
	if err != nil {
		port = 587
	}

	config := &SMTPConfig{
		Host:         getEnv("SMTP_HOST", "smtp.mailtrap.io"),
		Port:         port,
		Username:     getEnv("SMTP_USER", ""),
		Password:     getEnv("SMTP_PASSWORD", ""),
		FromEmail:    getEnv("SMTP_FROM_EMAIL", "noreply@sitivent.com"),
		FromName:     getEnv("SMTP_FROM_NAME", "SITIVENT"),
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3000"),
		VerifyURL:    getEnv("EMAIL_VERIFICATION_URL", "http://localhost:3000/verify-email"),
		ResetURL:     getEnv("RESET_PASSWORD_URL", "http://localhost:3000/reset-password"),
		SupportEmail: getEnv("SUPPORT_EMAIL", "support@sitivent.com"),
	}

	// Validate SMTP credentials
	if config.Username == "" || config.Password == "" {
		return nil, fmt.Errorf("SMTP credentials not configured: SMTP_USER and SMTP_PASSWORD environment variables are required")
	}

	// Validate SMTP host
	if config.Host == "" {
		return nil, fmt.Errorf("SMTP host not configured: SMTP_HOST environment variable is required")
	}

	return &SMTPEmailService{
		config: config,
	}, nil
}

// SendVerificationEmail sends an email verification email
func (s *SMTPEmailService) SendVerificationEmail(to, name, token string) error {
	verificationURL := fmt.Sprintf("%s?token=%s", s.config.VerifyURL, token)

	data := s.layoutData(name)
	data.ShowIcon = false
	data.VerificationURL = verificationURL
	data.Category, data.IconBackground, data.IconColor, data.Icon = "ACCOUNT", "#bfe4c7", "#36784b", "check"
	data.Eyebrow, data.Title = "STATUS AKUN", "Verifikasi email kamu."
	data.Message, data.CTAURL, data.CTALabel = "Selesaikan verifikasi email untuk mengaktifkan akun dan mulai menggunakan SITIVENT.", verificationURL, "Verifikasi email"

	body, err := renderTemplate("verification.html", data)
	if err != nil {
		logger.Error("Failed to render verification email template", logger.Err(err))
		return err
	}

	subject := "Verifikasi Email Anda - SITIVENT"
	return s.sendEmail(to, subject, body)
}

// SendOTPVerificationEmail sends an OTP code for email verification
func (s *SMTPEmailService) SendOTPVerificationEmail(to, name, otpCode string) error {
	data := s.layoutData(name)
	data.ShowIcon = false
	data.OTPCode = otpCode
	data.Category, data.IconBackground, data.IconColor, data.Icon = "ACCOUNT", "#ffe5d8", "#ff7a45", "hash"
	data.Eyebrow, data.Title = "STATUS AKUN", "Masukkan kode verifikasi."
	data.Message, data.Code, data.CodeLabel, data.CodeExpiry = "Gunakan kode berikut untuk menyelesaikan verifikasi email akun SITIVENT.", otpCode, "KODE VERIFIKASI", "10 menit"

	body, err := renderTemplate("otp_verification.html", data)
	if err != nil {
		logger.Error("Failed to render OTP verification email template", logger.Err(err))
		return err
	}

	subject := "Kode Verifikasi SITIVENT"
	return s.sendEmail(to, subject, body)
}

// SendVerificationEmailWithOTP sends an email with both verification link and OTP code
func (s *SMTPEmailService) SendVerificationEmailWithOTP(to, name, token, otpCode string) error {
	// Build verification URL
	verificationURL := fmt.Sprintf("%s?token=%s", s.config.VerifyURL, token)

	data := s.layoutData(name)
	data.ShowIcon = false
	data.VerificationURL, data.OTPCode = verificationURL, otpCode
	data.Category, data.IconBackground, data.IconColor, data.Icon = "ACCOUNT", "#bfe4c7", "#36784b", "check"
	data.Eyebrow, data.Title = "STATUS AKUN", "Verifikasi email dengan link atau kode."
	data.Message, data.Code, data.CodeLabel, data.CodeExpiry = "Pilih cara yang paling mudah untuk menyelesaikan verifikasi akun SITIVENT.", otpCode, "KODE VERIFIKASI", "10 menit"
	data.CTAURL, data.CTALabel = verificationURL, "Verifikasi email"

	body, err := renderTemplate("verification_with_otp.html", data)
	if err != nil {
		logger.Error("Failed to render verification with OTP email template", logger.Err(err))
		return err
	}

	subject := "Verifikasi Email Anda - SITIVENT"
	return s.sendEmail(to, subject, body)
}

// SendPasswordResetEmail sends a password reset email
func (s *SMTPEmailService) SendPasswordResetEmail(to, name, token string) error {
	resetURL := fmt.Sprintf("%s?token=%s", s.config.ResetURL, token)

	data := s.layoutData(name)
	data.ResetPasswordURL = resetURL
	data.Category, data.IconBackground, data.IconColor, data.Icon = "SECURITY", "#ffe5d8", "#b84a2a", "alert"
	data.Eyebrow, data.Title = "", "Atur ulang kata sandimu."
	data.Message, data.CTAURL, data.CTALabel = "Kami menerima permintaan untuk mengatur ulang kata sandi akun SITIVENT.", resetURL, "Buat kata sandi baru"
	data.SecurityNote = "Tautan ini hanya dapat digunakan satu kali. Jika kamu tidak meminta reset password, abaikan email ini."

	body, err := renderTemplate("reset_password.html", data)
	if err != nil {
		logger.Error("Failed to render password reset email template", logger.Err(err))
		return err
	}

	subject := "Atur Ulang Kata Sandi SITIVENT"
	return s.sendEmail(to, subject, body)
}

// SendPasswordResetOTP sends an OTP code for password reset
func (s *SMTPEmailService) SendPasswordResetOTP(to, name, otpCode string) error {
	data := s.layoutData(name)
	data.OTPCode = otpCode
	data.Category, data.IconBackground, data.IconColor, data.Icon = "SECURITY", "#ffe5d8", "#b84a2a", "hash"
	data.Eyebrow, data.Title = "", "Kode reset password kamu."
	data.Message, data.Code, data.CodeLabel, data.CodeExpiry = "Gunakan kode berikut untuk membuat kata sandi baru.", otpCode, "KODE RESET PASSWORD", "10 menit"
	data.SecurityNote = "Jangan bagikan kode ini kepada siapa pun. Jika kamu tidak meminta reset password, abaikan email ini."

	body, err := renderTemplate("forgot_password_otp.html", data)
	if err != nil {
		logger.Error("Failed to render password reset OTP email template", logger.Err(err))
		return err
	}

	subject := "Kode Reset Kata Sandi SITIVENT"
	return s.sendEmail(to, subject, body)
}

// SendWelcomeEmail sends a welcome email to new users
func (s *SMTPEmailService) SendWelcomeEmail(to, name string) error {
	data := s.layoutData(name)
	data.Category, data.IconBackground, data.IconColor, data.Icon = "ACCOUNT", "#bfe4c7", "#36784b", "check"
	data.Eyebrow, data.Title = "AKUN SITIVENT", "Selamat datang di SITIVENT."
	data.Message, data.CTAURL, data.CTALabel = "Akunmu berhasil dibuat. Temukan event, simpan tiket digital, dan ikuti perjalanan event-mu dari satu tempat.", s.config.FrontendURL+"/events", "Jelajahi event"

	body, err := renderTemplate("welcome.html", data)
	if err != nil {
		logger.Error("Failed to render welcome email template", logger.Err(err))
		return err
	}

	subject := "Selamat Datang di SITIVENT!"
	return s.sendEmail(to, subject, body)
}

// SendAccountLockedEmail sends an email when account is locked
func (s *SMTPEmailService) SendAccountLockedEmail(to, name string) error {
	data := s.layoutData(name)
	data.Category, data.IconBackground, data.IconColor, data.Icon = "SECURITY", "#ffe5d8", "#b84a2a", "alert"
	data.Eyebrow, data.Title = "", "Akunmu dikunci sementara."
	data.Message, data.SecurityNote = "Kami mendeteksi beberapa percobaan login yang tidak berhasil. Untuk melindungi akunmu, aksesnya dikunci sementara.", "Jika ini bukan aktivitasmu, segera hubungi tim bantuan SITIVENT."

	body, err := renderTemplate("account_locked.html", data)
	if err != nil {
		logger.Error("Failed to render account locked email template", logger.Err(err))
		return err
	}

	subject := "Peringatan Keamanan Akun SITIVENT"
	return s.sendEmail(to, subject, body)
}

// SendPasswordChangedEmail sends an email when password is changed
func (s *SMTPEmailService) SendPasswordChangedEmail(to, name string) error {
	data := s.layoutData(name)
	data.Category, data.IconBackground, data.IconColor, data.Icon = "SECURITY", "#bfe4c7", "#36784b", "check"
	data.Eyebrow, data.Title = "", "Kata sandimu berhasil diubah."
	data.Message, data.SecurityNote = "Kata sandi akun SITIVENT berhasil diperbarui. Kamu bisa melanjutkan aktivitas seperti biasa.", "Jika kamu tidak melakukan perubahan ini, segera hubungi tim bantuan SITIVENT."

	body, err := renderTemplate("password_changed.html", data)
	if err != nil {
		logger.Error("Failed to render password changed email template", logger.Err(err))
		return err
	}

	subject := "Kata Sandi SITIVENT Berhasil Diubah"
	return s.sendEmail(to, subject, body)
}

func (s *SMTPEmailService) SendNewsletterConfirmation(to string) error {
	data := s.layoutData("")
	data.Email = to
	data.Category, data.IconBackground, data.IconColor, data.Icon = "NEWSLETTER", "#bfe4c7", "#36784b", "check"
	data.Eyebrow, data.Title = "NEWSLETTER SITIVENT", "Kamu sudah berlangganan."
	data.Message = "Terima kasih sudah bergabung. Kami akan mengirimkan kabar event dan informasi terbaru SITIVENT ke email ini."
	body, err := renderTemplate("newsletter_confirmation.html", data)
	if err != nil {
		return err
	}
	return s.sendEmail(to, "Selamat Datang di Newsletter SITIVENT!", body)
}

// sendEmail sends an email using SMTP
func (s *SMTPEmailService) sendEmail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", fmt.Sprintf("%s <%s>", s.config.FromName, s.config.FromEmail))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(s.config.Host, s.config.Port, s.config.Username, s.config.Password)

	// Use TLS for port 587 (STARTTLS)
	if s.config.Port == 587 {
		d.TLSConfig = &tls.Config{
			ServerName:         s.config.Host,
			InsecureSkipVerify: false,
		}
	}

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		logger.Error("Failed to send email",
			logger.String("to", to),
			logger.String("subject", subject),
			logger.Err(err),
		)
		return fmt.Errorf("failed to send email: %w", err)
	}

	logger.Info("Email sent successfully",
		logger.String("to", to),
		logger.String("subject", subject),
	)

	return nil
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
