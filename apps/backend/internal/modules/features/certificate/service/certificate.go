package service

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/url"
	"strings"
	"time"

	"venturo-skeleton-go/internal/modules/features/certificate/domain"
	"venturo-skeleton-go/internal/modules/features/certificate/dto"
	"venturo-skeleton-go/internal/modules/features/certificate/repository"
	"venturo-skeleton-go/pkg/logger"
	"venturo-skeleton-go/pkg/storage"

	"github.com/google/uuid"
)

var ErrInvalidRequest = errors.New("invalid certificate request")

type Repository interface {
	UpsertTemplate(context.Context, string, *string, *domain.Template) error
	GetTemplate(context.Context, string, *string) (*domain.Template, error)
	CreateJob(context.Context, string, *string, string, map[string]string) (*domain.GenerationJob, error)
	ClaimJob(context.Context, string) (*domain.GenerationJob, error)
	PendingJobIDs(context.Context, int) ([]string, error)
	RecoverInterruptedJobs(context.Context) error
	ListEligible(context.Context, string, string) ([]*domain.IssueData, error)
	SaveCertificate(context.Context, *domain.Certificate) error
	RecordJobResult(context.Context, string, bool, error) error
	FinishJob(context.Context, string, string, error) error
	GetJob(context.Context, string, *string) (*domain.GenerationJob, error)
	FindPublic(context.Context, string) (*domain.Certificate, error)
	ListMine(context.Context, string) ([]*domain.Certificate, error)
}

type CertificateService struct {
	repository    Repository
	generator     PDFGenerator
	storage       storage.Client
	publicBaseURL string
	workerCount   int
	queue         chan string
}

func NewCertificateService(repo Repository, generator PDFGenerator, storageClient storage.Client, publicBaseURL string, workerCount int) *CertificateService {
	if workerCount < 1 {
		workerCount = 1
	}
	if workerCount > 16 {
		workerCount = 16
	}
	return &CertificateService{
		repository: repo, generator: generator, storage: storageClient,
		publicBaseURL: strings.TrimRight(publicBaseURL, "/"), workerCount: workerCount,
		queue: make(chan string, workerCount*2),
	}
}

func (s *CertificateService) Start(ctx context.Context) error {
	if err := s.repository.RecoverInterruptedJobs(ctx); err != nil {
		return err
	}
	for range s.workerCount {
		go s.worker(ctx)
	}
	go s.dispatch(ctx)
	return nil
}

func (s *CertificateService) UpsertTemplate(ctx context.Context, eventID string, scopeTenantID *string, req dto.UpsertTemplateRequest) (*dto.TemplateResponse, error) {
	template := &domain.Template{
		EventID: eventID, BackgroundURL: req.BackgroundURL, NumberTemplate: req.NumberTemplate,
		NumberMode: req.NumberMode, ShowIssuedDate: req.ShowIssuedDate, ShowEventDate: req.ShowEventDate,
		ShowEventLocation: req.ShowEventLocation, ShowHeader: req.ShowHeader, HeaderText: req.HeaderText,
		HeaderSubtitle: req.HeaderSubtitle, HeaderFont: req.HeaderFont, HeaderColor: req.HeaderColor,
		TitleFont: req.TitleFont, TitleColor: req.TitleColor, ContentFont: req.ContentFont,
		ContentColor: req.ContentColor, PrimaryColor: req.PrimaryColor, FooterMarginBottom: req.FooterMarginBottom,
	}
	for _, item := range req.Signatures {
		template.Signatures = append(template.Signatures, domain.Signature{
			Name: item.Name, Title: item.Title, SignatureURL: item.SignatureURL, Order: item.Order,
		})
	}
	if template.NumberMode == domain.NumberModeAuto {
		for _, placeholder := range []string{"{TENANT}", "{SLUG}", "{REG_NO}"} {
			if !strings.Contains(template.NumberTemplate, placeholder) {
				return nil, fmt.Errorf("%w: automatic number template must contain %s", ErrInvalidRequest, placeholder)
			}
		}
	}
	if err := s.repository.UpsertTemplate(ctx, eventID, scopeTenantID, template); err != nil {
		return nil, err
	}
	response := templateResponse(template)
	return &response, nil
}

func (s *CertificateService) GetTemplate(ctx context.Context, eventID string, scopeTenantID *string) (*dto.TemplateResponse, error) {
	template, err := s.repository.GetTemplate(ctx, eventID, scopeTenantID)
	if err != nil {
		return nil, err
	}
	response := templateResponse(template)
	return &response, nil
}

func (s *CertificateService) Generate(ctx context.Context, eventID, actorID string, scopeTenantID *string, req dto.GenerateRequest) (*dto.JobResponse, error) {
	template, err := s.repository.GetTemplate(ctx, eventID, scopeTenantID)
	if err != nil {
		return nil, err
	}
	if template.NumberMode == domain.NumberModeManual && len(req.ManualNumbers) == 0 {
		return nil, fmt.Errorf("%w: manual_numbers are required for a manual certificate template", ErrInvalidRequest)
	}
	job, err := s.repository.CreateJob(ctx, eventID, scopeTenantID, actorID, req.ManualNumbers)
	if err != nil {
		return nil, err
	}
	s.enqueue(job.ID)
	response := jobResponse(job)
	return &response, nil
}

func (s *CertificateService) GetJob(ctx context.Context, id string, scopeTenantID *string) (*dto.JobResponse, error) {
	job, err := s.repository.GetJob(ctx, id, scopeTenantID)
	if err != nil {
		return nil, err
	}
	response := jobResponse(job)
	return &response, nil
}

func (s *CertificateService) Verify(ctx context.Context, identifier string) (*dto.CertificateResponse, error) {
	certificate, err := s.repository.FindPublic(ctx, identifier)
	if err != nil {
		return nil, err
	}
	response := certificateResponse(certificate)
	return &response, nil
}

func (s *CertificateService) ListMine(ctx context.Context, userID string) ([]dto.CertificateResponse, error) {
	certificates, err := s.repository.ListMine(ctx, userID)
	if err != nil {
		return nil, err
	}
	items := make([]dto.CertificateResponse, 0, len(certificates))
	for _, certificate := range certificates {
		items = append(items, certificateResponse(certificate))
	}
	return items, nil
}

func (s *CertificateService) dispatch(ctx context.Context) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	for {
		s.enqueuePending(ctx)
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		}
	}
}

func (s *CertificateService) enqueuePending(ctx context.Context) {
	ids, err := s.repository.PendingJobIDs(ctx, cap(s.queue))
	if err != nil {
		logger.Error("Failed to dispatch certificate jobs", logger.Err(err))
		return
	}
	for _, id := range ids {
		s.enqueue(id)
	}
}

func (s *CertificateService) enqueue(id string) {
	select {
	case s.queue <- id:
	default:
	}
}

func (s *CertificateService) worker(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case id := <-s.queue:
			if err := s.processJob(ctx, id); err != nil && !errors.Is(err, repository.ErrGenerationJobNotFound) {
				logger.Error("Certificate generation job failed", logger.String("job_id", id), logger.Err(err))
			}
		}
	}
}

func (s *CertificateService) processJob(ctx context.Context, id string) error {
	job, err := s.repository.ClaimJob(ctx, id)
	if err != nil {
		return err
	}
	template, err := s.repository.GetTemplate(ctx, job.EventID, &job.TenantID)
	if err != nil {
		_ = s.repository.FinishJob(ctx, job.ID, domain.JobFailed, err)
		return err
	}
	participants, err := s.repository.ListEligible(ctx, job.EventID, job.TenantID)
	if err != nil {
		_ = s.repository.FinishJob(ctx, job.ID, domain.JobFailed, err)
		return err
	}
	for _, participant := range participants {
		if err := s.issue(ctx, job, template, participant); err != nil {
			if recordErr := s.repository.RecordJobResult(ctx, job.ID, true, err); recordErr != nil {
				_ = s.repository.FinishJob(ctx, job.ID, domain.JobFailed, recordErr)
				return recordErr
			}
			continue
		}
		if err := s.repository.RecordJobResult(ctx, job.ID, false, nil); err != nil {
			_ = s.repository.FinishJob(ctx, job.ID, domain.JobFailed, err)
			return err
		}
	}
	completed, err := s.repository.GetJob(ctx, job.ID, &job.TenantID)
	if err != nil {
		return err
	}
	status := domain.JobCompleted
	if completed.Failed == completed.Total {
		status = domain.JobFailed
	} else if completed.Failed > 0 || completed.Processed < completed.Total {
		status = domain.JobPartial
	}
	return s.repository.FinishJob(ctx, job.ID, status, nil)
}

func (s *CertificateService) issue(ctx context.Context, job *domain.GenerationJob, template *domain.Template, participant *domain.IssueData) error {
	number := job.ManualNumbers[participant.RegistrationID]
	if template.NumberMode == domain.NumberModeAuto {
		number = strings.NewReplacer(
			"{TENANT}", participant.TenantCode,
			"{SLUG}", participant.EventSlug,
			"{REG_NO}", participant.RegistrationNumber,
		).Replace(template.NumberTemplate)
	}
	number = strings.TrimSpace(number)
	if number == "" || len(number) > 100 {
		return fmt.Errorf("invalid certificate number for registration %s", participant.RegistrationID)
	}
	certificateID := uuid.NewString()
	verificationURL := s.publicBaseURL + "/features/v1/certificates/verify/" + url.PathEscape(certificateID)
	pdf, err := s.generator.Generate(ctx, PDFInput{
		CertificateNumber: number, VerificationURL: verificationURL, IssuedAt: time.Now(),
		Issue: participant, Template: template,
	})
	if err != nil {
		return err
	}
	objectPath := fmt.Sprintf("certificates/%s/%s.pdf", participant.EventID, certificateID)
	file, err := s.storage.Upload(ctx, &storage.UploadInput{Reader: bytes.NewReader(pdf), ObjectPath: objectPath, ContentType: "application/pdf"})
	if err != nil {
		return fmt.Errorf("upload certificate PDF: %w", err)
	}
	certificate := &domain.Certificate{
		ID: certificateID, RegistrationID: participant.RegistrationID, EventID: participant.EventID,
		UserID: participant.UserID, CertificateNumber: number, PDFURL: file.PublicURL, DownloadURL: file.PublicURL,
		Signatures: append([]domain.Signature(nil), template.Signatures...),
	}
	if err := s.repository.SaveCertificate(ctx, certificate); err != nil {
		_ = s.storage.Delete(ctx, file.ObjectPath)
		return err
	}
	return nil
}

func templateResponse(template *domain.Template) dto.TemplateResponse {
	response := dto.TemplateResponse{
		ID: template.ID, TenantID: template.TenantID, EventID: template.EventID,
		BackgroundURL: template.BackgroundURL, NumberTemplate: template.NumberTemplate,
		NumberMode: template.NumberMode, ShowIssuedDate: template.ShowIssuedDate,
		ShowEventDate: template.ShowEventDate, ShowEventLocation: template.ShowEventLocation,
		ShowHeader: template.ShowHeader, HeaderText: template.HeaderText, HeaderSubtitle: template.HeaderSubtitle,
		HeaderFont: template.HeaderFont, HeaderColor: template.HeaderColor, TitleFont: template.TitleFont,
		TitleColor: template.TitleColor, ContentFont: template.ContentFont, ContentColor: template.ContentColor,
		PrimaryColor: template.PrimaryColor, FooterMarginBottom: template.FooterMarginBottom,
		Signatures: make([]dto.SignatureResponse, 0, len(template.Signatures)),
		CreatedAt:  template.CreatedAt, UpdatedAt: template.UpdatedAt,
	}
	for _, signature := range template.Signatures {
		response.Signatures = append(response.Signatures, dto.SignatureResponse{
			ID: signature.ID, Name: signature.Name, Title: signature.Title,
			SignatureURL: signature.SignatureURL, Order: signature.Order,
		})
	}
	return response
}

func certificateResponse(certificate *domain.Certificate) dto.CertificateResponse {
	response := dto.CertificateResponse{
		ID: certificate.ID, RegistrationID: certificate.RegistrationID, EventID: certificate.EventID,
		CertificateNumber: certificate.CertificateNumber, ParticipantName: certificate.ParticipantName,
		ParticipantEmail: certificate.ParticipantEmail, EventTitle: certificate.EventTitle,
		IssuerFaculty: certificate.TenantName, EventDate: certificate.EventDate,
		PDFURL: certificate.PDFURL, DownloadURL: certificate.DownloadURL,
		Signatures: make([]dto.SignatureResponse, 0, len(certificate.Signatures)), IssuedAt: certificate.CreatedAt,
	}
	for _, signature := range certificate.Signatures {
		response.Signatures = append(response.Signatures, dto.SignatureResponse{
			ID: signature.ID, Name: signature.Name, Title: signature.Title,
			SignatureURL: signature.SignatureURL, Order: signature.Order,
		})
	}
	return response
}

func jobResponse(job *domain.GenerationJob) dto.JobResponse {
	return dto.JobResponse{
		ID: job.ID, EventID: job.EventID, Status: job.Status, Total: job.Total,
		Processed: job.Processed, Failed: job.Failed, LastError: job.LastError,
		StartedAt: job.StartedAt, FinishedAt: job.FinishedAt,
		CreatedAt: job.CreatedAt, UpdatedAt: job.UpdatedAt,
	}
}
