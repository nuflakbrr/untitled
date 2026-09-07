package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"venturo-skeleton-go/internal/modules/core/role/domain"
	"venturo-skeleton-go/internal/modules/core/role/dto"
	"venturo-skeleton-go/pkg/logger"

	"github.com/google/uuid"
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

func (r *RoleRepository) Create(ctx context.Context, req dto.CreateRoleRequest, tenantID *string) (*domain.Role, error) {
	role := &domain.Role{ID: uuid.NewString(), Name: req.Name, Description: req.Description, TenantID: tenantID, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	err := r.db.QueryRow(ctx, `INSERT INTO roles (id,name,description,tenant_id) VALUES ($1,$2,$3,$4) RETURNING created_at,updated_at`, role.ID, role.Name, role.Description, role.TenantID).Scan(&role.CreatedAt, &role.UpdatedAt)
	return role, err
}

func (r *RoleRepository) Update(ctx context.Context, id string, req dto.UpdateRoleRequest) error {
	_, err := r.db.Exec(ctx, `UPDATE roles SET name=COALESCE($2,name), description=COALESCE($3,description), updated_at=NOW() WHERE id=$1`, id, req.Name, req.Description)
	return err
}

func (r *RoleRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM roles WHERE id=$1`, id)
	return err
}

func (r *RoleRepository) ListPermissions(ctx context.Context) ([]domain.Permission, error) {
	rows, err := r.db.Query(ctx, `SELECT id,name,description,created_at,updated_at FROM permissions ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var result []domain.Permission
	for rows.Next() {
		var p domain.Permission
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, p)
	}
	return result, rows.Err()
}

func (r *RoleRepository) CreatePermission(ctx context.Context, req dto.CreatePermissionRequest) (*domain.Permission, error) {
	p := &domain.Permission{ID: uuid.NewString(), Name: req.Name, Description: &req.Description}
	err := r.db.QueryRow(ctx, `INSERT INTO permissions (id,name,description) VALUES ($1,$2,$3) RETURNING created_at,updated_at`, p.ID, p.Name, p.Description).Scan(&p.CreatedAt, &p.UpdatedAt)
	return p, err
}
func (r *RoleRepository) UpdatePermission(ctx context.Context, id string, req dto.UpdatePermissionRequest) error {
	_, err := r.db.Exec(ctx, `UPDATE permissions SET name=COALESCE($2,name),description=COALESCE($3,description),updated_at=NOW() WHERE id=$1`, id, req.Name, req.Description)
	return err
}
func (r *RoleRepository) DeletePermission(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM permissions WHERE id=$1`, id)
	return err
}

func (r *RoleRepository) SetPermissions(ctx context.Context, roleID string, permissionIDs []string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if _, err = tx.Exec(ctx, `DELETE FROM role_has_permissions WHERE role_id=$1`, roleID); err != nil {
		return err
	}
	for _, permissionID := range permissionIDs {
		if _, err = tx.Exec(ctx, `INSERT INTO role_has_permissions (role_id,permission_id) VALUES ($1,$2)`, roleID, permissionID); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}

func (r *RoleRepository) GetPermissionIDs(ctx context.Context, roleID string) ([]string, error) {
	rows, err := r.db.Query(ctx, `SELECT permission_id FROM role_has_permissions WHERE role_id=$1`, roleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}

// FindAll retrieves roles visible to the caller: every role when scopeTenantID
// is nil (root superadmin), otherwise global template roles (tenant_id IS
// NULL) plus that tenant's own custom roles.
func (r *RoleRepository) FindAll(ctx context.Context, scopeTenantID *string) ([]domain.Role, error) {
	query := `
		SELECT id, name, COALESCE(description, ''), tenant_id, created_at, updated_at
		FROM roles
	`
	args := []interface{}{}
	if scopeTenantID != nil {
		query += ` WHERE (tenant_id IS NULL AND name <> 'root_superadmin') OR tenant_id = $1`
		args = append(args, *scopeTenantID)
	}
	query += ` ORDER BY created_at ASC`

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query roles: %w", err)
	}
	defer rows.Close()

	var roles []domain.Role
	for rows.Next() {
		var role domain.Role
		if err := rows.Scan(&role.ID, &role.Name, &role.Description, &role.TenantID, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan role: %w", err)
		}
		roles = append(roles, role)
	}
	return roles, nil
}

// FindByID retrieves a role by ID
func (r *RoleRepository) FindByID(ctx context.Context, id string) (*domain.Role, error) {
	query := `
		SELECT id, name, COALESCE(description, ''), tenant_id, created_at, updated_at
		FROM roles
		WHERE id = $1
	`
	var role domain.Role
	err := r.db.QueryRow(ctx, query, id).Scan(&role.ID, &role.Name, &role.Description, &role.TenantID, &role.CreatedAt, &role.UpdatedAt)
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
		JOIN user_has_tenants uht ON rhp.role_id = uht.role_id
		WHERE uht.user_id = $1
		  AND ($2::text IS NULL OR uht.tenant_id = $2)
		UNION
		SELECT DISTINCT p.name
		FROM permissions p
		JOIN role_has_permissions rhp ON p.id = rhp.permission_id
		JOIN users u ON rhp.role_id = u.role_id
		JOIN roles r ON r.id = rhp.role_id
		WHERE u.id = $1
		  AND ($2::text IS NULL OR r.tenant_id IS NULL)
		UNION
		SELECT DISTINCT p.name
		FROM permissions p
		JOIN role_has_permissions rhp ON p.id = rhp.permission_id
		JOIN _role_to_user rtu ON rhp.role_id = rtu."A"
		WHERE rtu."B" = $1
		  AND $2::text IS NULL
	`
	var activeTenantID any
	if tenantID != nil && *tenantID != "" {
		activeTenantID = *tenantID
	}
	rows, err := r.db.Query(ctx, query, userID, activeTenantID)
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
