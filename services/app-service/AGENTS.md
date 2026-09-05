# app-service: Agent Rules

## Overview

The `app-service` provides the Go HTTP API backend service for setupmoney.
The service uses Chi for HTTP routing, sqlc for type-safe database access, goose for migrations, and PostgreSQL for storage.

## Directory Structure

```
services/app-service/
├── cmd/
│   └── app-service/     # Executable entry point and process lifecycle
├── internal/
│   ├── config/          # Typed environment configuration and validation
│   ├── platform/        # Shared runtime dependencies (clock, logger)
│   ├── server/          # HTTP server configuration and graceful shutdown
│   ├── version/         # Build version injected via linker flags
│   └── <domain>/        # Domain modules containing handler.go, service.go, repo.go
├── go.mod
└── AGENTS.md
```

## Naming & File Conventions

- File Names: Authors MUST use `kebab-case` names (for example `logger.go`, `server.go`, `user-repo.go`).
- Package Names: Authors MUST use lowercase single-word names (for example `config`, `platform`, `server`, `version`, `accounts`).
- Exported Symbols: Authors MUST use `PascalCase` for exported types, functions, and constants.
- Unexported Symbols: Authors MUST use `camelCase` for unexported package symbols.
- Domain Packages: Authors MUST organize business domains under `internal/<domain>/` separating `handler.go`, `service.go`, and `repo.go`.

## Hard Constraints

- The author MUST follow Test-Driven Development (TDD) by writing failing unit tests (`*_test.go`) first.
- The author SHALL NOT install new Go dependencies without explicit user confirmation.
- The author SHALL run `go vet ./...` and `go test ./...` after modifying Go files.
- The author SHALL NOT modify generated files under `db/generated/`.
- The author SHALL NOT use GORM for database access.
- The author SHALL execute all database queries through sqlc generated code.
- The author SHALL NOT commit `.env` files or secrets.
- The author SHALL redact sensitive credentials, tokens, and database secrets from logs and errors.
