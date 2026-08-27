.PHONY: help install dev dev-fe dev-be build lint test test-api test-api-bail tsc clean db-setup db-reset docker-up docker-down

export PATH := $(HOME)/go/bin:/Library/PostgreSQL/18/bin:/Library/PostgreSQL/17/bin:/Library/PostgreSQL/16/bin:/opt/homebrew/bin:/opt/homebrew/opt/libpq/bin:/usr/local/bin:$(PATH)

help:
	@echo "Venturo Monorepo Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install all dependencies with Bun"
	@echo "  make dev          - Run all apps in dev mode (Turbo + Bun + Air)"
	@echo "  make dev-fe       - Run Next.js frontend only"
	@echo "  make dev-be       - Run Go backend only (Air)"
	@echo ""
	@echo "Build & Quality:"
	@echo "  make build        - Build all apps (Next.js & Go)"
	@echo "  make lint         - Run linters across all apps"
	@echo "  make test         - Run tests across all apps"
	@echo "  make test-api     - Run backend API endpoint tests"
	@echo "  make test-api-bail - Stop API tests on first failure"
	@echo "  make tsc          - Run TypeScript type checks"
	@echo "  make clean        - Clean build caches & node_modules"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup     - Run backend migrations and seeders (local DB)"
	@echo "  make db-reset     - Reset local database (drop, recreate, migrate, seed)"
	@echo ""
	@echo "Docker (Opsional):"
	@echo "  make docker-up    - Start PostgreSQL & Redis via Docker Compose"
	@echo "  make docker-down  - Stop PostgreSQL & Redis via Docker Compose"

install:
	@bun install

dev:
	@bun run dev

dev-fe:
	@bun run --filter untitled-frontend dev

dev-be:
	@bun run --filter untitled-backend dev

build:
	@bun run build

lint:
	@bun run lint

test:
	@bun run test

test-api:
	@$(MAKE) -C apps/backend test-api

test-api-bail:
	@$(MAKE) -C apps/backend test-api BAIL=--bail

tsc:
	@bun run tsc:check

clean:
	@bun run clean

# Database commands (Native PostgreSQL & Redis)
db-setup:
	@$(MAKE) -C apps/backend db-setup

db-reset:
	@$(MAKE) -C apps/backend db-reset

# Optional Docker commands
docker-up:
	@docker compose up -d

docker-down:
	@docker compose down
