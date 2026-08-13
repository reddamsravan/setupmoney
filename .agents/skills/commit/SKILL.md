---
name: commit
description: >-
  Use this skill whenever you need to stage changes, write a git commit message, or generate a changeset file.
  Enforces Conventional Commits format and the changesets release workflow for setupmoney.
---

# Commit & Changeset Workflow

Follow this guide to stage files, craft conventional commit messages, and create changeset files for user-facing changes in the setupmoney project.

---

## 1. Commit Message Format

All commit messages MUST follow the Conventional Commits specification:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Format Rules

- **Tense & Mood**: Use the imperative, present tense ("add", "fix", "change", not "added" or "fixing").
- **Case**: Lowercase for description. No period at the end of the subject line.
- **Scope**: Optional. When provided, must match one of the allowed scopes below (e.g. `feat(ui): add Button` or `docs: update README`).

---

## 2. Allowed Types

| Type       | Description                                                            | Triggers Changeset? |
| ---------- | ---------------------------------------------------------------------- | ------------------- |
| `feat`     | A new feature for the user                                             | Yes (Minor)         |
| `fix`      | A bug fix for the user                                                 | Yes (Patch)         |
| `perf`     | A code change that improves performance                                | Yes (Patch)         |
| `chore`    | Changes to build process, auxiliary tools, or non-src files            | No                  |
| `docs`     | Documentation-only changes                                             | No                  |
| `refactor` | Code change that neither fixes a bug nor adds a feature                | No                  |
| `test`     | Adding missing tests or correcting existing tests                      | No                  |
| `style`    | Code formatting changes (white-space, formatting, missing semi-colons) | No                  |
| `build`    | Changes that affect the build system or external dependencies          | No                  |
| `ci`       | Changes to CI configuration files and scripts                          | No                  |
| `revert`   | Reverts a previous commit                                              | No                  |
| `deps`     | Dependency updates                                                     | No                  |

---

## 3. Allowed Scopes

Select the single scope that best describes the location of your change:

| Scope     | Description / Target Packages                                                 |
| --------- | ----------------------------------------------------------------------------- |
| `ui`      | Web application (`apps/web`) and UI components (`packages/components`)        |
| `api`     | Go backend service (`services/app-service`)                                   |
| `tokens`  | Design tokens package (`packages/tokens`)                                     |
| `auth`    | Authentication & authorization mechanisms (OIDC, Authentik, RBAC)             |
| `db`      | Database migrations (goose) and sqlc generated code                           |
| `ci`      | GitHub Actions workflows and CI scripts (`.github/workflows`)                 |
| `docs`    | Repository documentation (`README.md`, `CONTRIBUTING.md`, architectural docs) |
| `release` | Release configuration, changesets setup, and GoReleaser config                |

---

## 4. Atomicity Rule

- **Single Scope per Commit**: Each commit MUST affect only a single scope.
- **Multi-scope Changes**: If a logical change spans multiple scopes (e.g., adding an API endpoint in `api` and consuming it in `ui`), split the work into separate atomic commits.

---

## 5. Changeset Decision Tree

For every commit, determine if a changeset file (`.changeset/*.md`) is required:

```
Is the change user-facing (feat, fix, or perf)?
 ├── YES ──► Does it contain a BREAKING CHANGE?
 │            ├── YES ──► Create changeset with MAJOR bump
 │            └── NO  ──► Is it a `feat`?
 │                         ├── YES ──► Create changeset with MINOR bump
 │                         └── NO (fix/perf) ──► Create changeset with PATCH bump
 └── NO ───► Skip changeset creation
```

### Generating a Changeset File

Run `pnpm changeset` or manually create a markdown file in `.changeset/` with a random filename (e.g. `.changeset/quick-pandas-dance.md`):

```markdown
---
"setupmoney": minor
---

add Button component to @setupmoney/components
```

---

## 6. Worked Examples

### Example 1: New Feature in UI (With Changeset)

```text
feat(ui): add Button component to @setupmoney/components
```

_Changeset file created (`.changeset/happy-lions-sing.md`):_

```markdown
---
"setupmoney": minor
---

Add reusable Button component with primary and secondary variants.
```

### Example 2: Bug Fix in API (With Changeset)

```text
fix(api): handle null pointer exception in transaction handler
```

_Changeset file created (`.changeset/wet-flies-jump.md`):_

```markdown
---
"setupmoney": patch
---

Fix panic when retrieving transactions with missing category ID.
```

### Example 3: CI Maintenance (No Changeset)

```text
chore(ci): update GitHub Actions workflow to Node 20
```

_(No changeset file generated)_

### Example 4: Breaking API Change (With Major Changeset)

```text
feat(api): change transaction list response structure

BREAKING CHANGE: The `transactions` JSON response key has been renamed to `items`.
```

_Changeset file created (`.changeset/brave-owls-fly.md`):_

```markdown
---
"setupmoney": major
---

Change transaction list response wrapper key from `transactions` to `items`.
```
