# @setupmoney/tokens — Agent Rules

## Overview

`@setupmoney/tokens` manages design tokens for setupmoney using Style Dictionary v5. It generates CSS custom properties (variables) that are consumed by `@setupmoney/components` and `apps/web`.

---

## Token Layering Architecture

Tokens are structured in three distinct layers under `src/`:

1. **Primitives** (`src/primitives/`): Flat single-file per category (e.g. `color.json`, `spacing.json`, `typography.json`, `border.json`, `shadow.json`, `motion.json`, `z-index.json`).
2. **Semantic** (`src/semantic/`): Intent-driven tokens referencing primitives (e.g. `color.background.primary: "{color.blue.600}"`).
3. **Themes** (`src/themes/`): Mode-specific overrides (`light.json` and `dark.json`).

---

## Hard Constraints & Rules

- **Mandatory Color Format**: All color tokens MUST use the **OKLCH** color space (e.g. `"oklch(0.62 0.22 255)"` or `"oklch(0.62 0.22 255 / 0.5)"`). Do not use hex, RGB, or HSL.
- **Unit Standard**: Dimension-based primitive tokens (spacing, sizing, typography, borders, breakpoints) MUST use **`rem`** units.
- **Spacing & Sizing Scale**: Primitive spacing and sizing tokens use numeric pixel-equivalent keys (e.g. `"4": { "value": "0.25rem" }`, `"8": { "value": "0.5rem" }`, `"16": { "value": "1rem" }`).
- **Theme Output Targeting**: Theme CSS custom properties MUST target `:root` for light default, `[data-theme="dark"]` for explicit toggle, and `@media (prefers-color-scheme: dark)` as OS fallback.
- **Strict Rebuild Rule**: NEVER add, remove, or modify token JSON files without immediately running `pnpm build` in `packages/tokens` to regenerate output files under `build/`.
- **CSS Custom Property Format**: Output CSS variables follow the `--<category>-<subcategory>-<item>` naming convention without brand prefixes.
- **Reference Syntax**: Use Style Dictionary alias syntax to reference primitives inside semantic tokens (e.g. `{color.gray.100}`).

---

## Token Workflow

When adding or updating tokens:

1. Edit JSON files under `src/primitives/`, `src/semantic/`, or `src/themes/`.
2. Run `pnpm build` inside `packages/tokens/`.
3. Inspect `build/css/tokens.css` to verify output custom properties.
