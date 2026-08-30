package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"venturo-skeleton-go/internal/modules/features/testimonial/dto"
)

var ErrNotEligible = errors.New("registration is not eligible for a review")

type Repository struct{ db *pgxpool.Pool }

func New(db *pgxpool.Pool) *Repository { return &Repository{db: db} }

func (r *Repository) Create(ctx context.Context, userID, registrationID string, req dto.CreateTestimonialRequest) (*dto.TestimonialResponse, error) {
	var result dto.TestimonialResponse
	result.ID, result.RegistrationID, result.Rating, result.Comment = uuid.NewString(), registrationID, req.Rating, req.Comment
	err := r.db.QueryRow(ctx, `
		INSERT INTO testimonials (id, registration_id, event_id, user_id, rating, comment)
		SELECT $1, r.id, r.event_id, r.user_id, $2, $3
		FROM registrations r JOIN events e ON e.id = r.event_id
		WHERE r.id = $4 AND r.user_id = $5 AND r.status = 'CHECKED_IN' AND e.status = 'COMPLETED'
		RETURNING event_id`, result.ID, req.Rating, req.Comment, registrationID, userID).Scan(&result.EventID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotEligible
	}
	return &result, err
}

func (r *Repository) ListMine(ctx context.Context, userID string) ([]dto.TestimonialResponse, error) {
	rows, err := r.db.Query(ctx, `SELECT id, registration_id, event_id, rating, comment FROM testimonials WHERE user_id=$1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var results []dto.TestimonialResponse
	for rows.Next() {
		var item dto.TestimonialResponse
		if err := rows.Scan(&item.ID, &item.RegistrationID, &item.EventID, &item.Rating, &item.Comment); err != nil {
			return nil, err
		}
		results = append(results, item)
	}
	return results, rows.Err()
}
