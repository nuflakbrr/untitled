package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/core/role/domain"
	"venturo-skeleton-go/pkg/logger"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRoleNotFound = errors.New("role not found")
)

type RoleRepository struct {
	db *pgxpool.Pool
}

func NewRoleRepository(db *pgxpool.Pool) *RoleRepository {
	return &RoleRepository{db: db}
}

// FindAll retrieves all roles
func (r *RoleRepository) FindAll(ctx context.Context) ([]domain.Role, error) {
	query := `
		SELECT id, name, COALESCE(description, ''), created_at, updated_at
		FROM roles
		ORDER BY created_at ASC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query roles: %w", err)
	}
	defer rows.Close()

	var roles []domain.Role
	for rows.Next() {
		var role domain.Role
		if err := rows.Scan(&role.ID, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan role: %w", err)
		}
		roles = append(roles, role)
	}
	return roles, nil
}

// FindByID retrieves a role by ID
func (r *RoleRepository) FindByID(ctx context.Context, id string) (*domain.Role, error) {
	query := `
		SELECT id, name, COALESCE(description, ''), created_at, updated_at
		FROM roles
		WHERE id = $1
	`
	var role domain.Role
	err := r.db.QueryRow(ctx, query, id).Scan(&role.ID, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, fmt.Errorf("failed to find role by id: %w", err)
	}
	return &role, nil
}

// FindByName retrieves a role by name
func (r *RoleRepository) FindByName(ctx context.Context, name string) (*domain.Role, error) {
	query := `
		SELECT id, name, COALESCE(description, ''), created_at, updated_at
		FROM roles
		WHERE name = $1
	`
	var role domain.Role
	err := r.db.QueryRow(ctx, query, name).Scan(&role.ID, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, fmt.Errorf("failed to find role by name: %w", err)
	}
	return &role, nil
}

// GetUserPermissions retrieves all distinct permission codes assigned to a user
func (r *RoleRepository) GetUserPermissions(ctx context.Context, userID string, tenantID *string) ([]string, error) {
	query := `
		SELECT DISTINCT p.name
		FROM permissions p
		JOIN role_has_permissions rhp ON p.id = rhp.permission_id
		JOIN _role_to_user rtu ON rhp.role_id = rtu."A"
		WHERE rtu."B" = $1
		UNION
		SELECT DISTINCT p.name
		FROM permissions p
		JOIN role_has_permissions rhp ON p.id = rhp.permission_id
		JOIN users u ON rhp.role_id = u.role_id
		WHERE u.id = $1
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		logger.Error("Failed to query user permissions", logger.Err(err))
		return nil, err
	}
	defer rows.Close()

	var permissions []string
	for rows.Next() {
		var perm string
		if err := rows.Scan(&perm); err != nil {
			return nil, err
		}
		permissions = append(permissions, perm)
	}

	return permissions, nil
}

// GetUserRoles retrieves all role names for a user
func (r *RoleRepository) GetUserRoles(ctx context.Context, userID string, tenantID *string) ([]domain.Role, error) {
	query := `
		SELECT r.id, r.name, COALESCE(r.description, ''), r.created_at, r.updated_at
		FROM roles r
		JOIN _role_to_user rtu ON r.id = rtu."A"
		WHERE rtu."B" = $1
		UNION
		SELECT r.id, r.name, COALESCE(r.description, ''), r.created_at, r.updated_at
		FROM roles r
		JOIN users u ON r.id = u.role_id
		WHERE u.id = $1
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []domain.Role
	for rows.Next() {
		var role domain.Role
		if err := rows.Scan(&role.ID, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}
	return roles, nil
}

// GetUserRoleNames retrieves role names as strings
func (r *RoleRepository) GetUserRoleNames(ctx context.Context, userID string, tenantID *string) ([]string, error) {
	roles, err := r.GetUserRoles(ctx, userID, tenantID)
	if err != nil {
		return nil, err
	}
	var names []string
	for _, role := range roles {
		names = append(names, role.Name)
	}
	return names, nil
}
