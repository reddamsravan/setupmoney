# @setupmoney/components: Agent Rules

## Overview

The `@setupmoney/components` package provides the SolidJS UI component library for setupmoney.
The package builds outputs using `vite`.
Components consume design tokens from `@setupmoney/tokens` using CSS custom properties and co-located CSS Modules.

## Naming & File Conventions

- File Names: Authors MUST format all file names using `kebab-case` (for example `button.tsx`, `button.module.css`, `card-header.tsx`).
- SolidJS Components: Authors MUST name component functions using `PascalCase` (for example `export const Button: Component<ButtonProps>`).
- CSS Modules: Authors MUST co-locate CSS Module files beside component files (for example `src/forms/button/button.module.css` beside `src/forms/button/button.tsx`).
- Class Names: Authors MUST use `camelCase` class names inside module files (for example `.primaryButton`, `.sizeMd`).

## Directory Structure

```
packages/components/
├── src/
│   ├── forms/       # Button, Input, Select, Checkbox, ColorPicker
│   ├── layout/      # Card, Sidebar, Collapsible, Table
│   ├── feedback/    # Badge, Modal, Dropdown, Spinner, Skeleton, Toast
│   └── index.ts     # Barrel file re-exporting all components
├── package.json
└── tsconfig.json
```

## Hard Constraints

- The author MUST export every component through `src/index.ts`.
- Component styles MUST consume `@setupmoney/tokens` custom properties (for example `var(--color-background-primary)`).
- Component styles SHALL NOT use hardcoded raw color values.
- The package MUST target SolidJS exclusively.
- Authors SHALL NOT use React APIs or React dependencies.
