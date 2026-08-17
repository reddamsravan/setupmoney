# setupmoney

A personal finance web app built as a pnpm monorepo. The project is organized into three layers:

- **`@setupmoney/tokens`** — design token pipeline powered by Style Dictionary, producing CSS custom properties for colors, typography, spacing, and more
- **`@setupmoney/components`** — a SolidJS component library built with tsdown, consuming tokens via CSS Modules
- **`@setupmoney/utils`** — shared formatting utilities (currency, dates, numbers) used across the monorepo
- **`apps/web`** — the main SolidJS web app using TanStack Router and Vite, consuming the packages above

## Tokens Package TODOs

### Phase 1 — Token Structure

- [ ] Add primitive token files under `src/primitives/` for all categories:
  - [x] `colors.json` (OKLCH color scales: gray, primary blue, success green, warning amber, error red)
  - [ ] `typography.json` (Font family, font weights, font sizes, line heights, letter spacing in `rem`)
  - [x] `spacing.json` (Numeric pixel-equivalent scale `4`, `8`, `12`, `16`, `24`, `32`, `48`, `64` in `rem`)
  - [x] `sizing.json` (Component sizing scale in `rem`)
  - [x] `shadows.json` (Elevation box-shadow values)
  - [x] `borders.json` (Border radii, border widths in `rem`)
  - [ ] `motion.json` (Transition durations, easing curves)
  - [ ] `z-index.json` (Layer stacking order indices)
  - [ ] `breakpoints.json` (Responsive breakpoint widths in `rem`)
- [ ] Add `src/semantic/` layer with tokens that reference primitives (e.g. `color.background.primary → {color.blue.600}`)
- [ ] Add `src/themes/` with `light.json` and `dark.json` to override semantic tokens per theme

### Phase 2 — Style Dictionary Config

- [ ] Update `config.js` to output per-theme CSS (`:root` for light, `[data-theme="dark"]` for dark)
- [ ] Add `files` field to `package.json` so only `build/` is included in releases
- [ ] Add `prepare` script to `package.json` to auto-build on install/release
- [ ] Add `build/` to `.gitignore` (generate on release, not committed)

### Phase 3 — Package Wiring

- [ ] Add `"exports": { ".": "./build/css/tokens.css" }` to tokens `package.json`
- [ ] Add `@setupmoney/tokens: "workspace:*"` as a dependency in `apps/web`
- [ ] Add `@setupmoney/tokens: "workspace:*"` as a dependency in `packages/components`
- [ ] Import tokens CSS in the web app entry point (e.g. `main.tsx`)

### Phase 4 — Components

- [ ] Rename `components` package to `@setupmoney/components` for consistency
- [ ] Scaffold SolidJS component structure in `packages/components`

## Components Package TODOs

### Phase 1 — Package Setup

- [ ] Rename package to `@setupmoney/components` in `package.json`
- [ ] Add `tsdown` as devDependency and `solid-js` as peerDependency
- [ ] Add `tsconfig.json` extending `../../tsconfig.base.json` with SolidJS JSX settings (`jsx: preserve`, `jsxImportSource: solid-js`)
- [ ] Add `"exports": { ".": "./dist/index.js" }` to `package.json`
- [ ] Add `build` script (`tsdown`) and `dev` script (`tsdown --watch`) to `package.json`
- [ ] Add `dist/` to `.gitignore`

### Phase 2 — Source Structure

- [ ] Create `src/forms/` — Button, Input, Select, Checkbox components
- [x] Create `src/layout/` — Card, Sidebar/Nav, Table components
- [ ] Create `src/feedback/` — Badge, Modal, Spinner, Toast, Avatar components
- [x] Create `src/index.ts` as a barrel file re-exporting all components

### Phase 3 — Styling

- [ ] Co-locate `.module.css` file per component using `--color-*` CSS token variables
- [x] Add `@setupmoney/tokens: "workspace:*"` as a dependency in `packages/components`

### Phase 4 — Wiring

- [ ] Add `@setupmoney/components: "workspace:*"` as a dependency in `apps/web`
- [ ] Add tsdown watch to the root `dev` script to run in parallel with Vite

## Web App (`apps/web`) TODOs

### Phase 1 — Foundation

- [x] Add `@setupmoney/tokens: "workspace:*"` as a dependency in `apps/web`
- [x] Add `@setupmoney/components: "workspace:*"` as a dependency in `apps/web`
- [x] Create `src/styles/global.css` with CSS reset and base styles
- [x] Import `global.css` and tokens CSS in `main.tsx`
- [ ] Redirect `/` → `/dashboard` (update `index.tsx` or convert to a redirect)

### Phase 2 — Layout Shell

- [x] Refactor `__root.tsx` into a shell layout with collapsible sidebar (desktop) and bottom tab bar (mobile)
- [x] Remove `/about` from primary nav
- [x] Delegate sidebar/nav rendering to `Sidebar` component from `@setupmoney/components`

### Phase 3 — Shared State

- [ ] Create `src/stores/theme.ts` — SolidJS context/signal for dark/light theme toggle
- [ ] Create `src/stores/account.ts` — SolidJS context/signal for active/selected account
- [ ] Wire theme store to apply `data-theme` attribute on `<html>` for token-based theming

### Phase 4 — Utilities Package

- [x] Create `packages/utils` workspace package with its own `package.json` and `tsconfig.json`
- [ ] Add currency formatter utility (e.g. `formatCurrency(amount, currency)`)
- [ ] Add date formatter utility (e.g. `formatDate(date, format)`)
- [ ] Add number/percentage formatter utility
- [ ] Add `@setupmoney/utils: "workspace:*"` as a dependency in `apps/web`

### Phase 5 — Page Scaffolding

- [ ] Define static/mock data shapes for each route (Transactions, Accounts, Budget, Goals, Assets, Reports)
- [ ] Scaffold Dashboard page with summary cards and recent transactions
- [ ] Scaffold Transactions page with filterable table
- [ ] Scaffold Accounts page with account list and balances
- [ ] Scaffold Budget page with category breakdown
- [ ] Scaffold Goals page with progress indicators
- [ ] Scaffold Assets page with asset list and values
- [ ] Scaffold Reports page with charts/summary view

## Agent/LLM Setup TODOs

### Phase 1 — Agent Instructions

- [x] Create root `AGENTS.md` covering: monorepo structure, package relationships, naming conventions (files, components, CSS variables), build/dev workflow, and "do not" rules (no Tailwind, no React, don't add dependencies without asking)
- [x] Create `packages/tokens/AGENTS.md` with token authoring rules (file placement, token naming, how to add a new category)
- [x] Create `packages/components/AGENTS.md` with component authoring rules (folder structure, CSS Modules co-location, barrel export pattern)
- [x] Create `.agents/skills/tokens/SKILL.md` with a Style Dictionary cheatsheet (adding primitives, semantic references, theme overrides)

### Phase 4 — Agent Skills

All skills live under `.agents/skills/<name>/` with a `SKILL.md` and optional `scripts/` directory. Commit convention: **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`) + Changesets for changelog.

- [x] Create `.agents/skills/add-token/SKILL.md` — step-by-step guide for adding a new Style Dictionary token category (primitive JSON → semantic reference → theme override → `pnpm build` in tokens package)
- [x] Create `.agents/skills/add-component/SKILL.md` — guide for scaffolding a new SolidJS component in `@setupmoney/components` (create folder under `src/<category>/`, TSX file, CSS Module, add to `src/index.ts` barrel export, rebuild with tsdown)
- [ ] Create `.agents/skills/add-go-domain/SKILL.md` + `scripts/` — guide for adding a new Go domain (`internal/<domain>/handler.go`, `service.go`, `repo.go`, goose migration, sqlc query file, `make generate`, unit tests with mocked repo)
- [ ] Create `.agents/skills/add-api-endpoint/SKILL.md` — guide for adding a single REST endpoint to an existing Go domain end-to-end (sqlc query → repo method → service method → handler → Chi route registration)
- [ ] Create `.agents/skills/add-route/SKILL.md` — guide for adding a new TanStack Router file-based route to `apps/web` (create file in `src/routes/`, add nav link, run dev to verify `routeTree.gen.ts` updates)
- [x] **`commit` skill** — Create `.agents/skills/commit/` directory
  - [x] Write `SKILL.md` with YAML frontmatter (`name: commit`, `description` explaining when to activate)
  - [x] Document all valid **types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `build`, `ci`, `perf`, `revert`, `deps` — each with a one-line description
  - [x] Document all valid **scopes** and their project mapping: `ui` (components + web app), `api` (Go service), `tokens` (design tokens), `auth` (authentication), `db` (migrations + sqlc), `ci` (GitHub Actions), `docs` (README/CONTRIBUTING), `release` (changesets/GoReleaser)
  - [x] Document the **message format**: `type[optional scope]: imperative present-tense description` (e.g. `feat(ui): add Button component` or `docs: add commit skill`)
  - [x] Document the **changeset decision tree**: `feat` → minor bump, `fix`/`perf` → patch bump, `BREAKING CHANGE` footer → major bump, all other types → no changeset
  - [x] Document the **atomicity rule**: if a change touches multiple scopes, split into separate commits — one per scope
  - [x] Include **worked examples** covering: a `feat(ui)` with changeset, a `fix(api)` with changeset, a `chore(ci)` without changeset, and a breaking change with `BREAKING CHANGE` footer + major changeset

### Phase 2 — Git Hygiene

- [x] Expand `.gitignore` to cover `build/`, `dist/`, `.tanstack/`, OS files (`.DS_Store`), and editor files (`.vscode/`, `.idea/`)
- [x] Add `lefthook` as a root devDependency
- [x] Create `lefthook.yml` with a pre-commit hook that runs `pnpm fmt` then `pnpm lint:fix`
- [x] Add `"prepare": "lefthook install"` to root `package.json` scripts

### Phase 3 — Documentation

- [ ] Flesh out `README.md` with: project overview, monorepo package map, prerequisites (Node, pnpm version), and key dev commands (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm fmt`)

## `services/app-service` (Go API) TODOs

### Phase 1 — Bootstrap

- [ ] Create `services/app-service/` directory
- [ ] Initialise Go module: `go mod init github.com/setupmoney/app-service`
- [ ] Create `cmd/server/main.go` entrypoint (Chi router, slog, godotenv)
- [ ] Create `.env.example` with required env vars (`DATABASE_URL`, `PORT`, `ENV`)
- [ ] Create `.air.toml` for live reload configuration
- [ ] Add `services/app-service/AGENTS.md` with Go-specific conventions (sqlc patterns, domain structure, error handling, slog usage)

### Phase 2 — Database

- [ ] Create `db/migrations/` with initial goose SQL migration files for all domains (accounts, transactions, budget, goals, assets)
- [ ] Create `db/queries/` with sqlc SQL query files per domain
- [ ] Create `sqlc.yaml` config pointing at queries and migrations
- [ ] Add a `generate` script (or Makefile target) to run `sqlc generate`

### Phase 3 — Domain Structure

- [ ] Scaffold `internal/accounts/` — handler, service, repo
- [ ] Scaffold `internal/transactions/` — handler, service, repo
- [ ] Scaffold `internal/budget/` — handler, service, repo
- [ ] Scaffold `internal/goals/` — handler, service, repo
- [ ] Scaffold `internal/assets/` — handler, service, repo
- [ ] Scaffold `internal/reports/` — handler, service, repo

### Phase 4 — Infrastructure

- [ ] Add CORS middleware to Chi router (allow `localhost:*` in dev)
- [ ] Create `docker-compose.yml` at repo root with PostgreSQL and app-service
- [ ] Add `.env` to `.gitignore`, keep `.env.example` committed

### Phase 5 — Dev Workflow Integration

- [ ] Add `air` start command to root dev workflow (Makefile or `pnpm dev` parallel script)
- [ ] Update `README.md` to document starting the full stack (frontend + backend + DB)

## Release & Distribution TODOs

### Phase 1 — Dockerfiles

- [ ] Create `services/app-service/Dockerfile` (multi-stage: build Go binary → minimal runtime image)
- [ ] Create `apps/web/Dockerfile` (multi-stage: `pnpm build` Vite output → Caddy serves static files)

### Phase 2 — Docker Compose

- [ ] Update `docker-compose.yml` (dev) — Postgres only, with health checks and named volume
- [ ] Create `docker-compose.prod.yml` — Caddy + app-service + Postgres with restart policies and named volumes
- [ ] Create `Caddyfile` — serve frontend static files, reverse proxy `/api/*` to app-service with automatic HTTPS

### Phase 3 — Changesets Setup

- [ ] Add `@changesets/cli` as a root devDependency
- [ ] Run `pnpm changeset init` to create `.changeset/config.json`
- [ ] Configure changesets for a single root-level app version (not per-package npm publishing)
- [ ] Add `changeset`, `version`, and `release` scripts to root `package.json`
- [ ] Install the Changesets GitHub bot (`changeset-bot`) on the repo for automated Version PRs

### Phase 4 — GoReleaser

- [ ] Create `services/app-service/.goreleaser.yml` — builds for `linux/amd64` + `linux/arm64`, Docker images pushed to `ghcr.io/setupmoney/app-service`, GitHub Release using `CHANGELOG.md` generated by changesets (disable GoReleaser's built-in changelog)

### Phase 5 — GitHub Actions

- [ ] Create `.github/workflows/ci.yml` — triggers on PR/push to `main`: runs `oxfmt --check`, `oxlint`, `pnpm build`, `go build ./...`, `go vet ./...`
- [ ] Create `.github/workflows/release.yml` — triggers on merge of Changesets Version PR: reads bumped version from root `package.json`, creates Git tag `v*`, runs GoReleaser to publish binaries + Docker images + GitHub Release

### Phase 6 — OSS Docs

- [ ] Create `CONTRIBUTING.md` — dev setup steps (prerequisites, `docker compose up`, `pnpm install`, `pnpm dev`, `air`), PR guidelines, how to write a changeset
- [ ] Update `README.md` — add self-hosting quickstart (`docker compose -f docker-compose.prod.yml up`), Docker image links, and latest release badge

## Testing TODOs

### Phase 1 — Go Unit Tests

- [ ] Define a `Repo` interface per domain (accounts, transactions, budget, goals, assets, reports) to enable mocking
- [ ] Add mock implementations of each `Repo` interface for use in tests
- [ ] Write unit tests for the service layer of each domain using mocked repos
- [ ] Write handler-level tests using `httptest` with mocked services
- [ ] Add `go test ./...` to the `ci.yml` GitHub Actions workflow

## API Spec TODOs

### Phase 1 — OpenAPI Setup

- [ ] Choose between `huma` (code-first, generates spec from Go types) or `oapi-codegen` (spec-first, generates Go from OpenAPI YAML)
- [ ] Integrate chosen tool into `app-service` and generate initial OpenAPI spec
- [ ] Expose the spec at `/api/openapi.json` and a Swagger UI at `/api/docs`
- [ ] Add spec generation to the `generate` Makefile target alongside `sqlc generate`

## Observability TODOs

### Phase 1 — Health Check

- [ ] Add a `GET /health` endpoint to the Go service returning service status and DB connectivity
- [ ] Wire `/health` into the Docker Compose `healthcheck` for the `app-service` container
- [ ] Document the health endpoint in `README.md` for self-hosters using uptime monitors

## Data Safety TODOs

### Phase 1 — Backup Documentation

- [ ] Add a "Backups" section to `README.md` documenting how to run manual `pg_dump` against the Docker Compose Postgres container
- [ ] Document how to restore from a backup dump
- [ ] Add a `backup.sh` example script to the repo root as a convenience reference

## GitHub Repo TODOs

### Phase 1 — Issue Templates

- [ ] Create `.github/ISSUE_TEMPLATE/bug_report.md` with reproduction steps, expected vs actual behaviour, and environment fields
- [ ] Create `.github/ISSUE_TEMPLATE/feature_request.md` with problem statement and proposed solution fields
- [ ] Create `.github/pull_request_template.md` with checklist (changeset added, tests pass, lint clean)

## Authentication TODOs

### Phase 1 — Go Auth Domain

- [ ] Scaffold `internal/auth/` — handler, service, repo
- [ ] Add goose migrations for `users`, `roles`, and `invites` tables
- [ ] Add sqlc queries for user lookup, role assignment, invite creation and redemption
- [ ] Add JWT validation middleware to Chi (validate Authentik-issued OIDC tokens on every protected request)
- [ ] Add RBAC middleware to Chi (check role claim: Owner / Member / Viewer)
- [ ] Add `GET /setup` endpoint — bootstraps first Owner account if no users exist, returns 409 if already set up
- [ ] Add invite generation endpoint (Owner only) — creates a signed, time-limited invite link
- [ ] Add invite redemption endpoint — validates token, creates user account with assigned role
- [ ] Update `internal/auth/` unit tests with mocked repo

### Phase 2 — Docker Compose

- [ ] Add Authentik (server + worker + Redis) to `docker-compose.prod.yml` as the full-stack variant
- [ ] Create `docker-compose.auth.yml` as a standalone Authentik-only Compose file for users who bring their own app
- [ ] Add Authentik OIDC client config variables to `.env.example` (`OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`)
- [ ] Add `AUTH_MODE` env var (`local` or `oidc`) to toggle between Authentik-backed and lightweight local auth
- [ ] Document Authentik setup steps in `README.md` (creating OIDC provider, linking to app-service)

### Phase 3 — Frontend Auth

- [ ] Add `src/stores/auth.ts` — SolidJS context for current user, role, and token refresh logic
- [ ] Add protected route guard in `__root.tsx` — redirect to `/login` if no valid session
- [ ] Add `/login` route — email+password form (for local auth) and SSO button (for OIDC)
- [ ] Add `/setup` route — first-run wizard UI: create Owner account or connect to existing OIDC provider
- [ ] Add `/invite/:token` route — invite redemption UI: set display name + password (for local auth)
- [ ] Add user management page (Owner-only): list users, send invite links, change roles, revoke access
- [ ] Update `apps/web` routes to reflect role-based access (hide/disable features for Viewer role)
