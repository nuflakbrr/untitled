package authz

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	goredis "github.com/redis/go-redis/v9"
)

type PermissionFetcher interface {
	GetUserPermissions(ctx context.Context, userID string, tenantID *string) ([]string, error)
}

type Service struct {
	redis   *goredis.Client
	fetcher PermissionFetcher
	ttl     time.Duration
}

func NewService(redis *goredis.Client, fetcher PermissionFetcher, ttl time.Duration) *Service {
	return &Service{
		redis:   redis,
		fetcher: fetcher,
		ttl:     ttl,
	}
}

func cacheKey(userID, tenantID string) string {
	if tenantID == "" {
		tenantID = "-"
	}
	return fmt.Sprintf("perms:user:%s:tenant:%s", userID, tenantID)
}

func (s *Service) GetPermissions(ctx context.Context, userID, tenantID string) ([]string, error) {
	if userID == "" {
		return nil, fmt.Errorf("authz: empty userID")
	}

	key := cacheKey(userID, tenantID)

	// 1. Try cache (if redis is available)
	if s.redis != nil {
		if raw, err := s.redis.Get(ctx, key).Bytes(); err == nil {
			var perms []string
			if jsonErr := json.Unmarshal(raw, &perms); jsonErr == nil {
				return perms, nil
			}
			_ = s.redis.Del(ctx, key).Err()
		}
	}

	// 2. Cache miss or no redis -> fetch from DB
	var tid *string
	if tenantID != "" {
		tid = &tenantID
	}
	perms, err := s.fetcher.GetUserPermissions(ctx, userID, tid)
	if err != nil {
		return nil, fmt.Errorf("authz: fetch user permissions: %w", err)
	}
	if perms == nil {
		perms = []string{}
	}

	// 3. Populate cache (if redis is available)
	if s.redis != nil {
		if payload, mErr := json.Marshal(perms); mErr == nil {
			_ = s.redis.Set(ctx, key, payload, s.ttl).Err()
		}
	}

	return perms, nil
}

func (s *Service) Has(ctx context.Context, userID, tenantID, permission string) (bool, error) {
	perms, err := s.GetPermissions(ctx, userID, tenantID)
	if err != nil {
		return false, err
	}
	for _, p := range perms {
		if p == permission {
			return true, nil
		}
	}
	return false, nil
}

func (s *Service) InvalidateUser(ctx context.Context, userID string) error {
	if s.redis == nil {
		return nil
	}
	iter := s.redis.Scan(ctx, 0, fmt.Sprintf("perms:user:%s:*", userID), 0).Iterator()
	for iter.Next(ctx) {
		_ = s.redis.Del(ctx, iter.Val()).Err()
	}
	return iter.Err()
}

func (s *Service) InvalidateAll(ctx context.Context) error {
	if s.redis == nil {
		return nil
	}
	iter := s.redis.Scan(ctx, 0, "perms:user:*", 0).Iterator()
	for iter.Next(ctx) {
		_ = s.redis.Del(ctx, iter.Val()).Err()
	}
	return iter.Err()
}
