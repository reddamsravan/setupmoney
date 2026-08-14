# @setupmoney/components — Agent Rules

## Overview

`@setupmoney/components` is the SolidJS UI component library for setupmoney, built using `tsdown`. It consumes design tokens from `@setupmoney/tokens` via CSS custom properties and co-located CSS Modules.

---

## Naming & File Conventions

- **File Names**: ALL file names must be strictly `kebab-case` (e.g. `button.tsx`, `button.module.css`, `card-header.tsx`).
- **SolidJS Components**: Component functions must be named in `PascalCase` (e.g. `export function Button(...)`).
- **CSS Modules**: Co-located with component files (e.g. `src/forms/button.module.css` beside `src/forms/button.tsx`). Class names inside module files use `camelCase` (e.g. `.primaryButton`).

---

## Directory Structure

```
packages/components/
├── src/
│   ├── forms/       # Button, Input, Select, Checkbox
│   ├── layout/      # Card, Sidebar, Table
│   ├── feedback/    # Badge, Modal, Spinner, Toast, Avatar
│   └── index.ts     # Barrel file re-exporting all components
├── package.json
└── tsconfig.json
```

---

## Hard Constraints

- **Strict Export Pattern**: Every component must be exported through `src/index.ts`.
- **Token Usage**: Styles must consume `@setupmoney/tokens` custom properties (e.g. `var(--color-background-primary)`) instead of hardcoded raw values.
- **Framework Target**: SolidJS only (JSX `preserve`, `jsxImportSource: solid-js`). Never use React.
