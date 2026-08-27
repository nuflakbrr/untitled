package audit

import (
	"context"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) List(ctx context.Context, f ListFilter) ([]AuditLogResponse, int64, error) {
	logs, total, err := s.repo.List(ctx, f)
	if err != nil {
		return nil, 0, err
	}

	var resps []AuditLogResponse
	for _, l := range logs {
		resps = append(resps, ToResponse(&l))
	}

	return resps, total, nil
}
