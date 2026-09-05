# setupmoney: Agent Rules

## Project Overview

setupmoney is a self-hosted personal finance web application.
The repository uses a pnpm monorepo structure with a Go backend service.
Users self-host the application using Docker Compose.
The project targets single users, families, and small independent groups.

## Monorepo Structure

```
setupmoney/
├── packages/
│   ├── tokens/        # @setupmoney/tokens: Style Dictionary design tokens -> CSS custom properties
│   ├── components/    # @setupmoney/components: SolidJS UI component library
│   └── utils/         # @setupmoney/utils: Shared formatters (currency, date, numbers)
├── apps/
│   └── web/           # @setupmoney/web: SolidJS app (Vite + TanStack Router)
└── services/
    └── app-service/   # Go REST API (Chi, sqlc, goose, PostgreSQL)
```

Packages consume workspace dependencies using `"workspace:*"`.

## Tech Stack

| Layer                   | Technology                                                                              |
| :---------------------- | :-------------------------------------------------------------------------------------- |
| Frontend framework      | SolidJS (not React)                                                                     |
| Routing                 | TanStack Solid Router (file-based, `src/routes/`)                                       |
| Build tool (app)        | Vite                                                                                    |
| Build tool (components) | tsdown                                                                                  |
| Styling                 | CSS Modules co-located with components; CSS custom properties from `@setupmoney/tokens` |
| Design tokens           | Style Dictionary v5 (`packages/tokens/`)                                                |
| Linter                  | oxlint                                                                                  |
| Formatter               | oxfmt                                                                                   |
| Package manager         | pnpm (workspace)                                                                        |
| Backend language        | Go                                                                                      |
| HTTP router             | Chi                                                                                     |
| DB access               | sqlc (type-safe Go from SQL)                                                            |
| Migrations              | goose                                                                                   |
| Database                | PostgreSQL                                                                              |
| Logging                 | `slog` (Go stdlib)                                                                      |
| Config                  | `os.LookupEnv` (process environment variables)                                          |
| Auth                    | Authentik (OIDC): JWT + HttpOnly cookies                                                |
| Live reload (Go)        | air                                                                                     |
| Containerisation        | Docker + Docker Compose                                                                 |

## Naming Conventions

- Files: The developer SHALL use `kebab-case` names (for example `button.tsx`, `format-currency.ts`, `user-repo.go`).
- SolidJS components: The developer SHALL use `PascalCase` names (for example `Button`, `TransactionTable`).
- Types, interfaces, and Go structs: The developer SHALL use `PascalCase` names.
- Variables and functions: The developer SHALL use `camelCase` for TypeScript and unexported Go symbols; use `PascalCase` for exported Go symbols.
- CSS custom properties: The developer SHALL use `--color-background-primary` default Style Dictionary naming without brand prefixes.
- CSS Module classes: The developer SHALL use `camelCase` names (for example `styles.primaryButton`).
- Go packages: The developer SHALL use lowercase single-word names (for example `accounts`, `auth`, `budget`).
- Go domain directories: The developer SHALL use `internal/<domain>/` containing `handler.go`, `service.go`, and `repo.go`.

## Key Commands

```bash
# Frontend / JS
pnpm dev          # Start all JS packages in watch/dev mode (parallel)
pnpm build        # Build all JS packages
pnpm lint         # Run oxlint across the workspace
pnpm lint:fix     # Run oxlint with auto-fix
pnpm fmt          # Run oxfmt formatter
pnpm fmt:check    # Check formatting without writing

# Go service
cd services/app-service
air               # Start Go service with live reload
go build ./...    # Build Go service
go test ./...     # Run all Go tests
go vet ./...      # Run Go vet

# Database
docker compose up -d          # Start PostgreSQL (dev)
cd services/app-service
make generate                 # Run sqlc generate + goose status

# Tokens
cd packages/tokens
pnpm build        # Run Style Dictionary to regenerate build/css/tokens.css
```

## Hard Constraints

- The agent MUST follow Test-Driven Development (TDD) by writing failing tests first.
- The agent SHALL NOT install new npm or Go dependencies without explicit user confirmation.
- The agent SHALL NOT modify generated files under `src/routeTree.gen.ts` or `services/app-service/db/generated/`.
- The agent SHALL run `pnpm fmt` and `pnpm lint:fix` after modifying JavaScript or TypeScript files.
- The agent SHALL run `go vet ./...` after modifying Go files.
- The agent SHALL NOT commit `.env` files or secrets.
- The agent SHALL NOT use GORM for database access.
- The agent SHALL execute all database queries through sqlc generated code.

## Test-Driven Development (TDD) Workflow

Every feature, bugfix, utility, UI component, and API endpoint MUST follow the Red-Green-Refactor TDD cycle:

1. Red (Write Failing Test):
   - For JS and TS packages (`apps/web`, `packages/components`, `packages/utils`), the author SHALL create unit tests using Vitest (`.test.ts` or `.test.tsx`).
   - For Go services (`services/app-service`), the author SHALL create Go unit tests (`*_test.go`).
   - The developer SHALL execute the test suite (`pnpm test` or `go test ./...`) and verify test failure.
2. Green (Minimal Implementation):
   - The developer SHALL write minimal production code to pass the failing test.
   - The developer SHALL execute the test suite to verify that all tests pass cleanly.
3. Refactor (Clean & Optimize):
   - The developer SHALL refactor code and styles while preserving passing tests.
   - The developer SHALL run code quality tools (`pnpm fmt`, `pnpm lint:fix`, `go vet ./...`).

## Per-Package Rules

Specific guidelines reside in package documentation:

- `packages/tokens/AGENTS.md`: Token authoring rules.
- `packages/components/AGENTS.md`: Component authoring rules.
- `services/app-service/AGENTS.md`: Go conventions for sqlc patterns, error handling, and domain structure.
