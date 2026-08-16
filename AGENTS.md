# setupmoney — Agent Rules

## Project Overview

setupmoney is a self-hosted personal finance web app. It is a pnpm monorepo with a Go backend service. Users self-host via Docker Compose. The project targets single users, families, and small independent groups.

---

## Monorepo Structure

```
setupmoney/
├── packages/
│   ├── tokens/        # @setupmoney/tokens  — Style Dictionary design tokens → CSS custom properties
│   ├── components/    # @setupmoney/components — SolidJS UI component library (tsdown)
│   └── utils/         # @setupmoney/utils   — Shared formatters (currency, date, numbers)
├── apps/
│   └── web/           # @setupmoney/web     — SolidJS app (Vite + TanStack Router)
└── services/
    └── app-service/   # Go REST API (Chi, sqlc, goose, PostgreSQL)
```

Packages are consumed as workspace dependencies using `"workspace:*"`.

---

## Tech Stack

| Layer                   | Technology                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------- |
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
| DB access               | sqlc (type-safe Go from SQL) — never GORM                                               |
| Migrations              | goose                                                                                   |
| Database                | PostgreSQL                                                                              |
| Logging                 | `slog` (Go stdlib)                                                                      |
| Config                  | godotenv (`.env` file)                                                                  |
| Auth                    | Authentik (OIDC) — JWT + HttpOnly cookies                                               |
| Live reload (Go)        | air                                                                                     |
| Containerisation        | Docker + Docker Compose                                                                 |

---

## Naming Conventions

- **Files**: `kebab-case` (e.g. `button.tsx`, `format-currency.ts`, `user-repo.go`)
- **SolidJS components**: `PascalCase` (e.g. `Button`, `TransactionTable`)
- **Types / interfaces / Go structs**: `PascalCase`
- **Variables and functions**: `camelCase` (TS/JS), `camelCase` (Go unexported), `PascalCase` (Go exported)
- **CSS custom properties**: `--color-background-primary` (Style Dictionary default, no brand prefix)
- **CSS Module classes**: `camelCase` (e.g. `styles.primaryButton`)
- **Go packages**: `lowercase`, single word (e.g. `accounts`, `auth`, `budget`)
- **Go domain folders**: `internal/<domain>/` with `handler.go`, `service.go`, `repo.go`

---

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

---

## Hard Constraints

- **Never install a new dependency** (npm or Go) without asking the user first.
- **Never modify auto-generated files**: `src/routeTree.gen.ts` and all files under `services/app-service/db/generated/` are auto-generated — do not edit them by hand.
- **Always run `pnpm fmt` and `pnpm lint:fix`** after making changes to JS/TS files.
- **Always run `go vet ./...`** after making changes to Go files.
- **Never commit `.env` files** or any file containing secrets. Only `.env.example` is committed.
- **Never use GORM** for database access. All DB queries go through sqlc-generated code.

---

## Per-Package Rules

More specific rules live in each package's own `AGENTS.md`:

- `packages/tokens/AGENTS.md` — token authoring rules
- `packages/components/AGENTS.md` — component authoring rules
- `services/app-service/AGENTS.md` — Go conventions (sqlc patterns, error handling, domain structure)
