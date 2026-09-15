package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrAccountReactivationTokenInvalid = errors.New("account reactivation token is invalid or expired")

type AccountReactivationRepository struct {
	db *pgxpool.Pool
}

func NewAccountReactivationRepository(db *pgxpool.Pool) *AccountReactivationRepository {
	return &AccountReactivationRepository{db: db}
}

func (r *AccountReactivationRepository) Create(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	if _, err := r.db.Exec(ctx, `
		DELETE FROM account_reactivation_tokens
		WHERE user_id = $1 AND (used_at IS NOT NULL OR expires_at <= NOW())`, userID); err != nil {
		return fmt.Errorf("failed to clean account reactivation tokens: %w", err)
	}

	if _, err := r.db.Exec(ctx, `
		INSERT INTO account_reactivation_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)`, userID, tokenHash, expiresAt); err != nil {
		return fmt.Errorf("failed to create account reactivation token: %w", err)
	}
	return nil
}

func (r *AccountReactivationRepository) Consume(ctx context.Context, tokenHash string) (string, error) {
	var userID string
	err := r.db.QueryRow(ctx, `
		UPDATE account_reactivation_tokens
		SET used_at = NOW()
		WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
		RETURNING user_id`, tokenHash).Scan(&userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", ErrAccountReactivationTokenInvalid
	}
	if err != nil {
		return "", fmt.Errorf("failed to consume account reactivation token: %w", err)
	}
	return userID, nil
}
