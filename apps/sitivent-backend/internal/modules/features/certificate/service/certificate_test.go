package service

import (
	"context"
	"errors"
	"fmt"
	"testing"
	"time"

	"venturo-skeleton-go/internal/modules/features/certificate/domain"
	"venturo-skeleton-go/internal/modules/features/certificate/dto"
	"venturo-skeleton-go/pkg/storage"
)

type repositoryStub struct {
	template     *domain.Template
	job          *domain.GenerationJob
	participants []*domain.IssueData
	saved        *domain.Certificate
	finished     string
	errAt        string
	err          error
}

func (r *repositoryStub) UpsertTemplate(_ context.Context, _ string, _ *string, template *domain.Template) error {
	template.ID, template.TenantID = "template-id", "tenant-id"
	r.template = template
	return nil
}
func (r *repositoryStub) GetTemplate(context.Context, string, *string) (*domain.Template, error) {
	if r.errAt == "template" {
		return nil, r.err
	}
	return r.template, nil
}
func (r *repositoryStub) CreateJob(context.Context, string, *string, string, map[string]string) (*domain.GenerationJob, error) {
	return r.job, nil
}
func (r *repositoryStub) ClaimJob(context.Context, string) (*domain.GenerationJob, error) {
	if r.errAt == "claim" {
		return nil, r.err
	}
	return r.job, nil
}
func (r *repositoryStub) PendingJobIDs(context.Context, int) ([]string, error) {
	if r.errAt == "pending" {
		return nil, r.err
	}
	return nil, nil
}
func (r *repositoryStub) RecoverInterruptedJobs(context.Context) error {
	if r.errAt == "recover" {
		return r.err
	}
	return nil
}
func (r *repositoryStub) ListEligible(context.Context, string, string) ([]*domain.IssueData, error) {
	if r.errAt == "eligible" {
		return nil, r.err
	}
	return r.participants, nil
}
func (r *repositoryStub) SaveCertificate(_ context.Context, certificate *domain.Certificate) error {
	r.saved = certificate
	return nil
}
func (r *repositoryStub) RecordJobResult(_ context.Context, _ string, failed bool, _ error) error {
	if r.errAt == "record" {
		return r.err
	}
	r.job.Processed++
	if failed {
		r.job.Failed++
	}
	return nil
}
func (r *repositoryStub) FinishJob(_ context.Context, _ string, status string, _ error) error {
	r.finished = status
	return nil
}
func (r *repositoryStub) GetJob(context.Context, string, *string) (*domain.GenerationJob, error) {
	if r.errAt == "get_job" {
		return nil, r.err
	}
	return r.job, nil
}
func (r *repositoryStub) FindPublic(context.Context, string) (*domain.Certificate, error) {
	return r.saved, nil
}
func (r *repositoryStub) ListMine(context.Context, string) ([]*domain.Certificate, error) {
	return []*domain.Certificate{r.saved}, nil
}

type generatorStub struct{ input PDFInput }

func (g *generatorStub) Generate(_ context.Context, input PDFInput) ([]byte, error) {
	g.input = input
	return []byte("%PDF-test"), nil
}

type panicGenerator struct{}

func (panicGenerator) Generate(context.Context, PDFInput) ([]byte, error) {
	panic("renderer crashed")
}

func TestProcessJobGeneratesAutomaticCertificate(t *testing.T) {
	repo := &repositoryStub{
		template: &domain.Template{NumberMode: domain.NumberModeAuto, NumberTemplate: "CERT/{TENANT}/{SLUG}/{REG_NO}"},
		job:      &domain.GenerationJob{ID: "job-id", EventID: "event-id", TenantID: "tenant-id", Total: 1},
		participants: []*domain.IssueData{{
			RegistrationID: "registration-id", RegistrationNumber: "REG-001", UserID: "user-id",
			EventID: "event-id", EventSlug: "seminar", TenantID: "tenant-id", TenantCode: "FT",
		}},
	}
	files, err := storage.NewLocalClient(t.TempDir(), "http://localhost:8000")
	if err != nil {
		t.Fatal(err)
	}
	generator := &generatorStub{}
	service := NewCertificateService(repo, generator, files, "http://localhost:8000", 1)
	if err := service.processJob(context.Background(), "job-id"); err != nil {
		t.Fatalf("processJob() error = %v", err)
	}
	if repo.finished != domain.JobCompleted || repo.saved == nil {
		t.Fatalf("job result = %q, certificate = %+v", repo.finished, repo.saved)
	}
	if repo.saved.CertificateNumber != "CERT/FT/seminar/REG-001" {
		t.Fatalf("certificate number = %q", repo.saved.CertificateNumber)
	}
	if generator.input.VerificationURL != "http://localhost:8000/features/v1/certificates/verify/"+repo.saved.ID {
		t.Fatalf("verification URL = %q", generator.input.VerificationURL)
	}
}

func TestUpsertTemplateRequiresAutomaticPlaceholders(t *testing.T) {
	repo := &repositoryStub{}
	service := NewCertificateService(repo, &generatorStub{}, nil, "http://localhost", 1)
	_, err := service.UpsertTemplate(context.Background(), "event-id", nil, dto.UpsertTemplateRequest{
		NumberMode: domain.NumberModeAuto, NumberTemplate: "CERT/{REG_NO}",
	})
	if err == nil {
		t.Fatal("UpsertTemplate() expected placeholder validation error")
	}
}

func TestGenerateRejectsMissingManualNumbers(t *testing.T) {
	repo := &repositoryStub{template: &domain.Template{NumberMode: domain.NumberModeManual}}
	service := NewCertificateService(repo, &generatorStub{}, nil, "http://localhost", 1)
	_, err := service.Generate(context.Background(), "event-id", "actor-id", nil, dto.GenerateRequest{})
	if err == nil {
		t.Fatal("Generate() expected manual number validation error")
	}
}

func TestCertificateServiceResponsesAndQueue(t *testing.T) {
	now := time.Now()
	repo := &repositoryStub{
		template: &domain.Template{
			ID: "template-id", EventID: "event-id", TenantID: "tenant-id", NumberMode: domain.NumberModeAuto,
			NumberTemplate: "CERT/{TENANT}/{SLUG}/{REG_NO}", Signatures: []domain.Signature{{ID: "signature-id", Name: "Dean"}},
		},
		job: &domain.GenerationJob{ID: "job-id", EventID: "event-id", TenantID: "tenant-id", Status: domain.JobPending, CreatedAt: now},
		saved: &domain.Certificate{
			ID: "certificate-id", EventID: "event-id", CertificateNumber: "CERT/FT/E/R",
			Signatures: []domain.Signature{{ID: "signature-id", Name: "Dean"}}, CreatedAt: now,
		},
	}
	service := NewCertificateService(repo, &generatorStub{}, nil, "http://localhost/", 0)
	if service.workerCount != 1 {
		t.Fatalf("worker count = %d", service.workerCount)
	}
	request := dto.UpsertTemplateRequest{
		NumberMode: domain.NumberModeAuto, NumberTemplate: "CERT/{TENANT}/{SLUG}/{REG_NO}",
		ShowHeader: true,
		Signatures: []dto.SignatureRequest{{Name: "Dean", SignatureURL: "https://example.com/sign.png"}},
	}
	if template, err := service.UpsertTemplate(context.Background(), "event-id", nil, request); err != nil || template.ID != "template-id" ||
		template.HeaderText != defaultHeaderText || template.HeaderSubtitle != defaultHeaderSubtitle {
		t.Fatalf("UpsertTemplate() = %+v, %v", template, err)
	}
	if template, err := service.GetTemplate(context.Background(), "event-id", nil); err != nil || len(template.Signatures) != 1 {
		t.Fatalf("GetTemplate() = %+v, %v", template, err)
	}
	if job, err := service.Generate(context.Background(), "event-id", "actor-id", nil, dto.GenerateRequest{}); err != nil || job.ID != "job-id" {
		t.Fatalf("Generate() = %+v, %v", job, err)
	}
	if job, err := service.GetJob(context.Background(), "job-id", nil); err != nil || job.ID != "job-id" {
		t.Fatalf("GetJob() = %+v, %v", job, err)
	}
	if certificate, err := service.Verify(context.Background(), "certificate-id"); err != nil || len(certificate.Signatures) != 1 {
		t.Fatalf("Verify() = %+v, %v", certificate, err)
	}
	if certificates, err := service.ListMine(context.Background(), "user-id"); err != nil || len(certificates) != 1 {
		t.Fatalf("ListMine() = %+v, %v", certificates, err)
	}
	service.enqueuePending(context.Background())
	if len(service.queue) == 0 {
		t.Fatal("Generate() should enqueue the durable job")
	}
}

func TestStartWithCancelledContext(t *testing.T) {
	repo := &repositoryStub{}
	service := NewCertificateService(repo, &generatorStub{}, nil, "http://localhost", 20)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := service.Start(ctx); err != nil {
		t.Fatalf("Start() error = %v", err)
	}
	if service.workerCount != 16 {
		t.Fatalf("worker count cap = %d", service.workerCount)
	}
}

func TestProcessJobMarksPartialWhenOneCertificateFails(t *testing.T) {
	repo := &repositoryStub{
		template: &domain.Template{NumberMode: domain.NumberModeManual},
		job: &domain.GenerationJob{
			ID: "job-id", EventID: "event-id", TenantID: "tenant-id", Total: 2,
			ManualNumbers: map[string]string{"registration-ok": "CERT/MANUAL/001"},
		},
		participants: []*domain.IssueData{
			{RegistrationID: "registration-ok", UserID: "user-1", EventID: "event-id"},
			{RegistrationID: "registration-missing", UserID: "user-2", EventID: "event-id"},
		},
	}
	files, err := storage.NewLocalClient(t.TempDir(), "http://localhost:8000")
	if err != nil {
		t.Fatal(err)
	}
	service := NewCertificateService(repo, &generatorStub{}, files, "http://localhost:8000", 1)
	if err := service.processJob(context.Background(), "job-id"); err != nil {
		t.Fatalf("processJob() error = %v", err)
	}
	if repo.finished != domain.JobPartial || repo.job.Processed != 2 || repo.job.Failed != 1 {
		t.Fatalf("partial job = status %q, processed %d, failed %d", repo.finished, repo.job.Processed, repo.job.Failed)
	}
}

func TestProcessJobGeneratesBatchOfOneHundred(t *testing.T) {
	participants := make([]*domain.IssueData, 100)
	for index := range participants {
		participants[index] = &domain.IssueData{
			RegistrationID:     fmt.Sprintf("registration-%03d", index),
			RegistrationNumber: fmt.Sprintf("REG-%03d", index),
			UserID:             fmt.Sprintf("user-%03d", index), EventID: "event-id",
			EventSlug: "graduation", TenantCode: "UMN",
		}
	}
	repo := &repositoryStub{
		template:     &domain.Template{NumberMode: domain.NumberModeAuto, NumberTemplate: "CERT/{TENANT}/{SLUG}/{REG_NO}"},
		job:          &domain.GenerationJob{ID: "job-100", EventID: "event-id", TenantID: "tenant-id", Total: 100},
		participants: participants,
	}
	files, err := storage.NewLocalClient(t.TempDir(), "http://localhost:8000")
	if err != nil {
		t.Fatal(err)
	}
	service := NewCertificateService(repo, &generatorStub{}, files, "http://localhost:8000", 4)
	if err := service.processJob(context.Background(), "job-100"); err != nil {
		t.Fatalf("processJob() error = %v", err)
	}
	if repo.finished != domain.JobCompleted || repo.job.Processed != 100 || repo.job.Failed != 0 {
		t.Fatalf("batch job = status %q, processed %d, failed %d", repo.finished, repo.job.Processed, repo.job.Failed)
	}
}

func TestProcessJobInfrastructureFailures(t *testing.T) {
	for _, stage := range []string{"claim", "template", "eligible", "record", "get_job"} {
		t.Run(stage, func(t *testing.T) {
			repo := &repositoryStub{
				template: &domain.Template{NumberMode: domain.NumberModeAuto, NumberTemplate: "CERT/{TENANT}/{SLUG}/{REG_NO}"},
				job:      &domain.GenerationJob{ID: "job-id", EventID: "event-id", TenantID: "tenant-id", Total: 1},
				participants: []*domain.IssueData{{
					RegistrationID: "registration-id", RegistrationNumber: "REG-1",
					UserID: "user-id", EventID: "event-id", EventSlug: "event", TenantCode: "FT",
				}},
				errAt: stage, err: errors.New("infrastructure failure"),
			}
			files, err := storage.NewLocalClient(t.TempDir(), "http://localhost")
			if err != nil {
				t.Fatal(err)
			}
			service := NewCertificateService(repo, &generatorStub{}, files, "http://localhost", 1)
			if err := service.processJob(context.Background(), "job-id"); err == nil {
				t.Fatalf("processJob() expected %s failure", stage)
			}
		})
	}
}

func TestRunJobRecoversRendererPanic(t *testing.T) {
	repo := &repositoryStub{
		template: &domain.Template{NumberMode: domain.NumberModeAuto, NumberTemplate: "CERT/{TENANT}/{SLUG}/{REG_NO}"},
		job:      &domain.GenerationJob{ID: "job-id", EventID: "event-id", TenantID: "tenant-id", Total: 1},
		participants: []*domain.IssueData{{
			RegistrationID: "registration-id", RegistrationNumber: "REG-1",
			UserID: "user-id", EventID: "event-id", EventSlug: "event", TenantCode: "FT",
		}},
	}
	service := NewCertificateService(repo, panicGenerator{}, nil, "http://localhost", 1)
	service.runJob(context.Background(), "job-id")
	if repo.finished != domain.JobFailed {
		t.Fatalf("panicked job status = %q", repo.finished)
	}
}

func TestStartReturnsRecoveryFailure(t *testing.T) {
	want := errors.New("recovery failed")
	service := NewCertificateService(&repositoryStub{errAt: "recover", err: want}, &generatorStub{}, nil, "http://localhost", 1)
	if err := service.Start(context.Background()); !errors.Is(err, want) {
		t.Fatalf("Start() error = %v", err)
	}
}
