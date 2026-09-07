package certificate

import (
	"context"
	"fmt"
	"strings"

	"venturo-skeleton-go/internal/config"
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/certificate/handler"
	"venturo-skeleton-go/internal/modules/features/certificate/repository"
	"venturo-skeleton-go/internal/modules/features/certificate/service"
	pkgstorage "venturo-skeleton-go/pkg/storage"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	Handler    *handler.CertificateHandler
	Service    *service.CertificateService
	Repository *repository.CertificateRepository
	LocalRoot  string
}

func Initialize(ctx context.Context, db *pgxpool.Pool, cfg *config.Config) (*Module, error) {
	repo := repository.NewCertificateRepository(db)
	var storageClient pkgstorage.Client
	localRoot := ""
	switch strings.ToLower(strings.TrimSpace(cfg.Certificate.StorageDriver)) {
	case "gcs":
		if cfg.GCS.BucketName == "" {
			return nil, fmt.Errorf("initialize certificate GCS storage: GCS_BUCKET_NAME is required")
		}
		client, err := pkgstorage.NewGCSClient(ctx, cfg.GCS.BucketName, cfg.GCS.CredentialsJSON)
		if err != nil {
			return nil, fmt.Errorf("initialize certificate GCS storage: %w", err)
		}
		storageClient = client
	case "local":
		client, err := pkgstorage.NewLocalClient(cfg.Certificate.LocalStorageDir, cfg.Certificate.PublicBaseURL)
		if err != nil {
			return nil, fmt.Errorf("initialize certificate local storage: %w", err)
		}
		storageClient = client
		localRoot = client.RootDir()
	default:
		return nil, fmt.Errorf("initialize certificate storage: unsupported driver %q", cfg.Certificate.StorageDriver)
	}
	certificateService := service.NewCertificateService(
		repo, service.NewGoPDFGenerator(cfg.Certificate.AssetTimeout), storageClient,
		cfg.Certificate.PublicBaseURL, cfg.Certificate.WorkerCount,
	)
	if err := certificateService.Start(ctx); err != nil {
		return nil, fmt.Errorf("start certificate workers: %w", err)
	}
	return &Module{
		Handler: handler.NewCertificateHandler(certificateService), Service: certificateService,
		Repository: repo, LocalRoot: localRoot,
	}, nil
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	certificates := router.Group("/certificates")
	certificates.GET("/verify/*identifier", m.Handler.Verify)
	protected := certificates.Group("", middleware.JWTAuth())
	{
		protected.PUT("/templates/event/:eventID", middleware.RequirePermission("certificates.create"), m.Handler.UpsertTemplate)
		protected.GET("/templates/event/:eventID", middleware.RequirePermission("certificates.read"), m.Handler.GetTemplate)
		protected.POST("/event/:eventID/generate", middleware.RequirePermission("certificates.create"), m.Handler.Generate)
		protected.GET("/jobs/:id", middleware.RequirePermission("certificates.read"), m.Handler.GetJob)
		protected.GET("/me", middleware.RequirePermission("certificates.read"), m.Handler.ListMine)
	}
}
