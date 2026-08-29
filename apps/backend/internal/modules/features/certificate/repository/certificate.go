package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/certificate/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrTemplateNotFound       = errors.New("certificate template not found")
	ErrCertificateNotFound    = errors.New("certificate not found")
	ErrEventNotEligible       = errors.New("event is not eligible for certificate generation")
	ErrNoEligibleParticipants = errors.New("no eligible participants found")
	ErrGenerationJobNotFound  = errors.New("certificate generation job not found")
	ErrGenerationJobActive    = errors.New("certificate generation is already running for this event")
	ErrCertificateExists      = errors.New("certificate already exists for registration")
)

type CertificateRepository struct{ db *pgxpool.Pool }

func NewCertificateRepository(db *pgxpool.Pool) *CertificateRepository {
	return &CertificateRepository{db: db}
}

func (r *CertificateRepository) UpsertTemplate(ctx context.Context, eventID string, scopeTenantID *string, template *domain.Template) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin certificate template upsert: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	query := `SELECT tenant_id FROM events WHERE id = $1 AND deleted_at IS NULL`
	args := []any{eventID}
	if scopeTenantID != nil {
		query += " AND tenant_id = $2"
		args = append(args, *scopeTenantID)
	}
	query += " FOR UPDATE"
	if err := tx.QueryRow(ctx, query, args...).Scan(&template.TenantID); errors.Is(err, pgx.ErrNoRows) {
		return ErrTemplateNotFound
	} else if err != nil {
		return fmt.Errorf("resolve certificate template event: %w", err)
	}

	template.EventID = eventID
	if template.ID == "" {
		template.ID = uuid.NewString()
	}
	err = tx.QueryRow(ctx, `
		INSERT INTO certificate_templates (
			id, tenant_id, event_id, background_url, number_template, number_mode,
			show_issued_date, show_event_date, show_event_location, show_header,
			header_text, header_subtitle, header_font, header_color, title_font,
			title_color, content_font, content_color, primary_color, footer_margin_bottom
		) VALUES (
			$1, $2, $3, NULLIF($4, ''), $5, $6::cert_number_mode,
			$7, $8, $9, $10, $11, $12, NULLIF($13, ''), NULLIF($14, ''),
			NULLIF($15, ''), NULLIF($16, ''), NULLIF($17, ''), NULLIF($18, ''),
			NULLIF($19, ''), $20
		)
		ON CONFLICT (event_id) DO UPDATE SET
			background_url = EXCLUDED.background_url, number_template = EXCLUDED.number_template,
			number_mode = EXCLUDED.number_mode, show_issued_date = EXCLUDED.show_issued_date,
			show_event_date = EXCLUDED.show_event_date, show_event_location = EXCLUDED.show_event_location,
			show_header = EXCLUDED.show_header, header_text = EXCLUDED.header_text,
			header_subtitle = EXCLUDED.header_subtitle, header_font = EXCLUDED.header_font,
			header_color = EXCLUDED.header_color, title_font = EXCLUDED.title_font,
			title_color = EXCLUDED.title_color, content_font = EXCLUDED.content_font,
			content_color = EXCLUDED.content_color, primary_color = EXCLUDED.primary_color,
			footer_margin_bottom = EXCLUDED.footer_margin_bottom, updated_at = NOW()
		RETURNING id, created_at, updated_at
	`, template.ID, template.TenantID, template.EventID, template.BackgroundURL,
		template.NumberTemplate, template.NumberMode, template.ShowIssuedDate,
		template.ShowEventDate, template.ShowEventLocation, template.ShowHeader,
		template.HeaderText, template.HeaderSubtitle, template.HeaderFont,
		template.HeaderColor, template.TitleFont, template.TitleColor,
		template.ContentFont, template.ContentColor, template.PrimaryColor,
		template.FooterMarginBottom,
	).Scan(&template.ID, &template.CreatedAt, &template.UpdatedAt)
	if err != nil {
		return fmt.Errorf("upsert certificate template: %w", err)
	}
	if _, err := tx.Exec(ctx, `DELETE FROM certificate_signatures WHERE template_id = $1`, template.ID); err != nil {
		return fmt.Errorf("replace certificate signatures: %w", err)
	}
	for index := range template.Signatures {
		signature := &template.Signatures[index]
		signature.ID = uuid.NewString()
		signature.TemplateID = template.ID
		if _, err := tx.Exec(ctx, `
			INSERT INTO certificate_signatures (id, template_id, name, title, signature_url, "order")
			VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6)
		`, signature.ID, signature.TemplateID, signature.Name, signature.Title, signature.SignatureURL, signature.Order); err != nil {
			return fmt.Errorf("insert certificate signature: %w", err)
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit certificate template: %w", err)
	}
	return nil
}

func (r *CertificateRepository) GetTemplate(ctx context.Context, eventID string, scopeTenantID *string) (*domain.Template, error) {
	conditions := "ct.event_id = $1"
	args := []any{eventID}
	if scopeTenantID != nil {
		conditions += " AND ct.tenant_id = $2"
		args = append(args, *scopeTenantID)
	}
	template := &domain.Template{}
	err := r.db.QueryRow(ctx, templateSelect+" WHERE "+conditions, args...).Scan(templateScanTargets(template)...)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrTemplateNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get certificate template: %w", err)
	}
	template.Signatures, err = r.loadSignatures(ctx, template.ID)
	if err != nil {
		return nil, err
	}
	return template, nil
}

func (r *CertificateRepository) CreateJob(ctx context.Context, eventID string, scopeTenantID *string, createdByID string, manualNumbers map[string]string) (*domain.GenerationJob, error) {
	job := &domain.GenerationJob{ID: uuid.NewString(), EventID: eventID, CreatedByID: createdByID, Status: domain.JobPending, ManualNumbers: manualNumbers}
	conditions := "e.id = $1 AND e.deleted_at IS NULL AND e.status = 'COMPLETED' AND e.certificate_enabled = TRUE"
	args := []any{eventID}
	if scopeTenantID != nil {
		conditions += " AND e.tenant_id = $2"
		args = append(args, *scopeTenantID)
	}
	err := r.db.QueryRow(ctx, `
		SELECT e.tenant_id, COUNT(r.id) FILTER (WHERE c.id IS NULL)
		FROM events e
		JOIN certificate_templates ct ON ct.event_id = e.id
		LEFT JOIN registrations r ON r.event_id = e.id AND r.status = 'CHECKED_IN' AND r.deleted_at IS NULL
		LEFT JOIN certificates c ON c.registration_id = r.id
		WHERE `+conditions+`
		GROUP BY e.tenant_id
	`, args...).Scan(&job.TenantID, &job.Total)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrEventNotEligible
	}
	if err != nil {
		return nil, fmt.Errorf("validate certificate generation event: %w", err)
	}
	if job.Total == 0 {
		return nil, ErrNoEligibleParticipants
	}
	manualJSON, err := json.Marshal(manualNumbers)
	if err != nil {
		return nil, fmt.Errorf("encode manual certificate numbers: %w", err)
	}
	err = r.db.QueryRow(ctx, `
		INSERT INTO certificate_generation_jobs (
			id, event_id, tenant_id, created_by_id, status, total, manual_numbers
		) VALUES ($1, $2, $3, $4, 'PENDING', $5, $6::jsonb)
		RETURNING created_at, updated_at
	`, job.ID, job.EventID, job.TenantID, job.CreatedByID, job.Total, manualJSON).Scan(&job.CreatedAt, &job.UpdatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" && pgErr.ConstraintName == "uq_certificate_generation_jobs_active_event" {
			return nil, ErrGenerationJobActive
		}
		return nil, fmt.Errorf("create certificate generation job: %w", err)
	}
	return job, nil
}

func (r *CertificateRepository) ClaimJob(ctx context.Context, id string) (*domain.GenerationJob, error) {
	job := &domain.GenerationJob{}
	var manualJSON []byte
	err := r.db.QueryRow(ctx, `
		UPDATE certificate_generation_jobs
		SET status = 'RUNNING', started_at = COALESCE(started_at, NOW()), updated_at = NOW()
		WHERE id = $1 AND status = 'PENDING'
		RETURNING id, event_id, tenant_id, created_by_id, status, total, processed, failed,
		          manual_numbers, COALESCE(last_error, ''), started_at, finished_at, created_at, updated_at
	`, id).Scan(jobScanTargets(job, &manualJSON)...)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrGenerationJobNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("claim certificate generation job: %w", err)
	}
	if err := json.Unmarshal(manualJSON, &job.ManualNumbers); err != nil {
		return nil, fmt.Errorf("decode manual certificate numbers: %w", err)
	}
	return job, nil
}

func (r *CertificateRepository) PendingJobIDs(ctx context.Context, limit int) ([]string, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id FROM certificate_generation_jobs
		WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT $1
	`, limit)
	if err != nil {
		return nil, fmt.Errorf("list pending certificate jobs: %w", err)
	}
	defer rows.Close()
	ids := make([]string, 0)
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, fmt.Errorf("scan pending certificate job: %w", err)
		}
		ids = append(ids, id)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate pending certificate jobs: %w", err)
	}
	return ids, nil
}

func (r *CertificateRepository) RecoverInterruptedJobs(ctx context.Context) error {
	_, err := r.db.Exec(ctx, `
		UPDATE certificate_generation_jobs
		SET status = 'PENDING', started_at = NULL, updated_at = NOW(),
		    last_error = 'generation interrupted; queued for retry'
		WHERE status = 'RUNNING' AND updated_at < NOW() - INTERVAL '15 minutes'
	`)
	if err != nil {
		return fmt.Errorf("recover interrupted certificate jobs: %w", err)
	}
	return nil
}

func (r *CertificateRepository) ListEligible(ctx context.Context, eventID, tenantID string) ([]*domain.IssueData, error) {
	rows, err := r.db.Query(ctx, `
		SELECT r.id, r.registration_number, r.user_id, COALESCE(u.name, ''), u.email, r.status::text,
		       e.id, e.title, e.slug, e.status::text, e.start_date, COALESCE(e.location, ''), e.certificate_enabled,
		       e.tenant_id, t.code, t.name
		FROM registrations r
		JOIN core.users u ON u.id = r.user_id
		JOIN events e ON e.id = r.event_id
		JOIN core.tenants t ON t.id = e.tenant_id
		LEFT JOIN certificates c ON c.registration_id = r.id
		WHERE r.event_id = $1 AND e.tenant_id = $2 AND r.status = 'CHECKED_IN'
		  AND r.deleted_at IS NULL AND e.status = 'COMPLETED'
		  AND e.certificate_enabled = TRUE AND c.id IS NULL
		ORDER BY r.created_at ASC
	`, eventID, tenantID)
	if err != nil {
		return nil, fmt.Errorf("list eligible certificate participants: %w", err)
	}
	defer rows.Close()
	items := make([]*domain.IssueData, 0)
	for rows.Next() {
		item := &domain.IssueData{}
		if err := rows.Scan(
			&item.RegistrationID, &item.RegistrationNumber, &item.UserID,
			&item.ParticipantName, &item.ParticipantEmail, &item.RegistrationStatus,
			&item.EventID, &item.EventTitle, &item.EventSlug, &item.EventStatus,
			&item.EventDate, &item.EventLocation, &item.CertificateEnabled,
			&item.TenantID, &item.TenantCode, &item.TenantName,
		); err != nil {
			return nil, fmt.Errorf("scan eligible certificate participant: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate eligible certificate participants: %w", err)
	}
	return items, nil
}

func (r *CertificateRepository) SaveCertificate(ctx context.Context, certificate *domain.Certificate) error {
	signaturesJSON, err := json.Marshal(certificate.Signatures)
	if err != nil {
		return fmt.Errorf("encode certificate signature snapshot: %w", err)
	}
	err = r.db.QueryRow(ctx, `
		INSERT INTO certificates (
			id, registration_id, event_id, user_id, certificate_number, pdf_url, download_url, signatures_snapshot
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
		RETURNING created_at, updated_at
	`, certificate.ID, certificate.RegistrationID, certificate.EventID, certificate.UserID,
		certificate.CertificateNumber, certificate.PDFURL, certificate.DownloadURL, signaturesJSON,
	).Scan(&certificate.CreatedAt, &certificate.UpdatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return ErrCertificateExists
		}
		return fmt.Errorf("save certificate: %w", err)
	}
	return nil
}

func (r *CertificateRepository) RecordJobResult(ctx context.Context, id string, failed bool, resultErr error) error {
	failedIncrement := 0
	lastError := ""
	if failed {
		failedIncrement = 1
		if resultErr != nil {
			lastError = resultErr.Error()
		}
	}
	tag, err := r.db.Exec(ctx, `
		UPDATE certificate_generation_jobs
		SET processed = processed + 1, failed = failed + $2,
		    last_error = CASE WHEN $3 <> '' THEN $3 ELSE last_error END, updated_at = NOW()
		WHERE id = $1 AND status = 'RUNNING'
	`, id, failedIncrement, lastError)
	if err != nil {
		return fmt.Errorf("record certificate job result: %w", err)
	}
	if tag.RowsAffected() != 1 {
		return ErrGenerationJobNotFound
	}
	return nil
}

func (r *CertificateRepository) FinishJob(ctx context.Context, id, status string, resultErr error) error {
	lastError := ""
	if resultErr != nil {
		lastError = resultErr.Error()
	}
	tag, err := r.db.Exec(ctx, `
		UPDATE certificate_generation_jobs
		SET status = $2, last_error = CASE WHEN $3 <> '' THEN $3 ELSE last_error END,
		    finished_at = NOW(), updated_at = NOW()
		WHERE id = $1 AND status = 'RUNNING'
	`, id, status, lastError)
	if err != nil {
		return fmt.Errorf("finish certificate generation job: %w", err)
	}
	if tag.RowsAffected() != 1 {
		return ErrGenerationJobNotFound
	}
	return nil
}

func (r *CertificateRepository) GetJob(ctx context.Context, id string, scopeTenantID *string) (*domain.GenerationJob, error) {
	conditions := "id = $1"
	args := []any{id}
	if scopeTenantID != nil {
		conditions += " AND tenant_id = $2"
		args = append(args, *scopeTenantID)
	}
	job := &domain.GenerationJob{}
	var manualJSON []byte
	err := r.db.QueryRow(ctx, `
		SELECT id, event_id, tenant_id, created_by_id, status, total, processed, failed,
		       manual_numbers, COALESCE(last_error, ''), started_at, finished_at, created_at, updated_at
		FROM certificate_generation_jobs WHERE `+conditions, args...).Scan(jobScanTargets(job, &manualJSON)...)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrGenerationJobNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get certificate generation job: %w", err)
	}
	if err := json.Unmarshal(manualJSON, &job.ManualNumbers); err != nil {
		return nil, fmt.Errorf("decode manual certificate numbers: %w", err)
	}
	return job, nil
}

func (r *CertificateRepository) FindPublic(ctx context.Context, identifier string) (*domain.Certificate, error) {
	certificate := &domain.Certificate{}
	var signaturesJSON []byte
	err := r.db.QueryRow(ctx, certificateSelect+`
		WHERE c.id = $1 OR c.certificate_number = $1
	`, identifier).Scan(certificateScanTargets(certificate, &signaturesJSON)...)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrCertificateNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("verify certificate: %w", err)
	}
	if err := json.Unmarshal(signaturesJSON, &certificate.Signatures); err != nil {
		return nil, fmt.Errorf("decode certificate signature snapshot: %w", err)
	}
	return certificate, nil
}

func (r *CertificateRepository) ListMine(ctx context.Context, userID string) ([]*domain.Certificate, error) {
	rows, err := r.db.Query(ctx, certificateSelect+` WHERE c.user_id = $1 ORDER BY c.created_at DESC`, userID)
	if err != nil {
		return nil, fmt.Errorf("list participant certificates: %w", err)
	}
	defer rows.Close()
	items := make([]*domain.Certificate, 0)
	for rows.Next() {
		certificate := &domain.Certificate{}
		var signaturesJSON []byte
		if err := rows.Scan(certificateScanTargets(certificate, &signaturesJSON)...); err != nil {
			return nil, fmt.Errorf("scan participant certificate: %w", err)
		}
		if err := json.Unmarshal(signaturesJSON, &certificate.Signatures); err != nil {
			return nil, fmt.Errorf("decode participant certificate signature snapshot: %w", err)
		}
		items = append(items, certificate)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate participant certificates: %w", err)
	}
	return items, nil
}

const templateSelect = `
	SELECT ct.id, ct.tenant_id, ct.event_id, COALESCE(ct.background_url, ''),
	       ct.number_template, ct.number_mode::text, ct.show_issued_date,
	       ct.show_event_date, ct.show_event_location, ct.show_header,
	       COALESCE(ct.header_text, ''), COALESCE(ct.header_subtitle, ''),
	       COALESCE(ct.header_font, ''), COALESCE(ct.header_color, ''),
	       COALESCE(ct.title_font, ''), COALESCE(ct.title_color, ''),
	       COALESCE(ct.content_font, ''), COALESCE(ct.content_color, ''),
	       COALESCE(ct.primary_color, ''), COALESCE(ct.footer_margin_bottom, 0),
	       ct.created_at, ct.updated_at
	FROM certificate_templates ct`

func templateScanTargets(template *domain.Template) []any {
	return []any{
		&template.ID, &template.TenantID, &template.EventID, &template.BackgroundURL,
		&template.NumberTemplate, &template.NumberMode, &template.ShowIssuedDate,
		&template.ShowEventDate, &template.ShowEventLocation, &template.ShowHeader,
		&template.HeaderText, &template.HeaderSubtitle, &template.HeaderFont,
		&template.HeaderColor, &template.TitleFont, &template.TitleColor,
		&template.ContentFont, &template.ContentColor, &template.PrimaryColor,
		&template.FooterMarginBottom, &template.CreatedAt, &template.UpdatedAt,
	}
}

const certificateSelect = `
	SELECT c.id, c.registration_id, c.event_id, c.user_id, c.certificate_number,
	       c.pdf_url, c.download_url, COALESCE(u.name, ''), u.email, e.title,
	       t.name, e.start_date, COALESCE(e.location, ''), c.created_at, c.updated_at,
	       c.signatures_snapshot
	FROM certificates c
	JOIN core.users u ON u.id = c.user_id
	JOIN events e ON e.id = c.event_id
	JOIN core.tenants t ON t.id = e.tenant_id`

func certificateScanTargets(certificate *domain.Certificate, signaturesJSON *[]byte) []any {
	return []any{
		&certificate.ID, &certificate.RegistrationID, &certificate.EventID,
		&certificate.UserID, &certificate.CertificateNumber, &certificate.PDFURL,
		&certificate.DownloadURL, &certificate.ParticipantName,
		&certificate.ParticipantEmail, &certificate.EventTitle, &certificate.TenantName,
		&certificate.EventDate, &certificate.EventLocation, &certificate.CreatedAt,
		&certificate.UpdatedAt, signaturesJSON,
	}
}

func jobScanTargets(job *domain.GenerationJob, manualJSON *[]byte) []any {
	return []any{
		&job.ID, &job.EventID, &job.TenantID, &job.CreatedByID, &job.Status,
		&job.Total, &job.Processed, &job.Failed, manualJSON, &job.LastError,
		&job.StartedAt, &job.FinishedAt, &job.CreatedAt, &job.UpdatedAt,
	}
}

func (r *CertificateRepository) loadSignatures(ctx context.Context, templateID string) ([]domain.Signature, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, template_id, name, COALESCE(title, ''), signature_url, "order"
		FROM certificate_signatures WHERE template_id = $1 ORDER BY "order", id
	`, templateID)
	if err != nil {
		return nil, fmt.Errorf("load certificate signatures: %w", err)
	}
	defer rows.Close()
	signatures := make([]domain.Signature, 0)
	for rows.Next() {
		var signature domain.Signature
		if err := rows.Scan(&signature.ID, &signature.TemplateID, &signature.Name, &signature.Title, &signature.SignatureURL, &signature.Order); err != nil {
			return nil, fmt.Errorf("scan certificate signature: %w", err)
		}
		signatures = append(signatures, signature)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate certificate signatures: %w", err)
	}
	return signatures, nil
}
