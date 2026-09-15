package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrPasswordResetTokenInvalid = errors.New("password reset token is invalid or expired")

type PasswordResetRepository struct {
	db *pgxpool.Pool
}

func NewPasswordResetRepository(db *pgxpool.Pool) *PasswordResetRepository {
	return &PasswordResetRepository{db: db}
}

func (r *PasswordResetRepository) Create(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	_, err := r.db.Exec(ctx, `
		DELETE FROM password_reset_tokens
		WHERE user_id = $1 AND (used_at IS NOT NULL OR expires_at <= NOW())`, userID)
	if err != nil {
		return fmt.Errorf("failed to clean password reset tokens: %w", err)
	}

	_, err = r.db.Exec(ctx, `
		INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)`, userID, tokenHash, expiresAt)
	if err != nil {
		return fmt.Errorf("failed to create password reset token: %w", err)
	}
	return nil
}

func (r *PasswordResetRepository) Consume(ctx context.Context, tokenHash string) (string, error) {
	var userID string
	err := r.db.QueryRow(ctx, `
		UPDATE password_reset_tokens
		SET used_at = NOW()
		WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
		RETURNING user_id`, tokenHash).Scan(&userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", ErrPasswordResetTokenInvalid
	}
	if err != nil {
		return "", fmt.Errorf("failed to consume password reset token: %w", err)
	}
	return userID, nil
}

func (r *PasswordResetRepository) Delete(ctx context.Context, tokenHash string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM password_reset_tokens WHERE token_hash = $1`, tokenHash)
	if err != nil {
		return fmt.Errorf("failed to delete password reset token: %w", err)
	}
	return nil
}
