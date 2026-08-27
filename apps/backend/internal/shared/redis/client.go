package redis

import (
	"context"
	"fmt"
	"net"
	"time"

	"venturo-skeleton-go/internal/config"

	goredis "github.com/redis/go-redis/v9"
)

// New builds a Redis client from config and verifies connectivity with PING.
// Returns an error so the caller can decide whether Redis is load-bearing
// (fatal) or optional (degraded-mode fallback).
func New(ctx context.Context, cfg config.RedisConfig) (*goredis.Client, error) {
	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)

	// Quick TCP probe to verify if Redis server is reachable before spinning up connection pool
	conn, err := net.DialTimeout("tcp", addr, 300*time.Millisecond)
	if err != nil {
		return nil, fmt.Errorf("redis server unreachable at %s: %w", addr, err)
	}
	_ = conn.Close()

	client := goredis.NewClient(&goredis.Options{
		Addr:         addr,
		Password:     cfg.Password,
		DB:           cfg.DB,
		DialTimeout:  1 * time.Second,
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
		PoolSize:     20,
		MinIdleConns: 2,
	})

	pingCtx, cancel := context.WithTimeout(ctx, 1*time.Second)
	defer cancel()

	if err := client.Ping(pingCtx).Err(); err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("redis ping failed (%s db=%d): %w", addr, cfg.DB, err)
	}

	return client, nil
}
