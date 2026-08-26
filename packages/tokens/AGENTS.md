# @setupmoney/tokens: Agent Rules

## Overview

The `@setupmoney/tokens` package manages design tokens for setupmoney using Style Dictionary v5.
The build system generates CSS custom properties for consumption by `@setupmoney/components` and `apps/web`.

## Token Layering Architecture

The package organizes tokens into three distinct layers under `src/`:

1. Primitives (`src/primitives/`): Flat single-file categories (for example `colors.json`, `spacing.json`, `typography.json`, `borders.json`, `shadows.json`, `motion.json`, `z-index.json`).
2. Semantic (`src/semantic/`): Intent-driven tokens referencing primitives (for example `color.background.primary: "{color.blue.600}"`).
3. Themes (`src/themes/`): Mode-specific overrides (`light.json` and `dark.json`).

## Hard Constraints & Rules

- Color Format: All color tokens MUST use the OKLCH color space (for example `"oklch(0.62 0.22 255)"` or `"oklch(0.62 0.22 255 / 0.5)"`). Authors SHALL NOT use hex, RGB, or HSL color strings.
- Unit Standard: Dimension-based primitive tokens (spacing, sizing, typography, borders, breakpoints) MUST use `rem` units.
- Spacing and Sizing Scale: Primitive spacing and sizing tokens MUST use numeric pixel-equivalent keys (for example `"4": { "value": "0.25rem" }`, `"8": { "value": "0.5rem" }`, `"16": { "value": "1rem" }`).
- Theme Selectors: Theme CSS custom properties MUST target `:root` for light default, `[data-theme="dark"]` for explicit toggle, and `@media (prefers-color-scheme: dark)` as OS fallback.
- Rebuild Requirement: Authors MUST run `pnpm build` inside `packages/tokens` immediately after adding, removing, or modifying token JSON files.
- Variable Format: Output CSS variables MUST follow the `--<category>-<subcategory>-<item>` naming convention without brand prefixes.
- Reference Syntax: Authors MUST use Style Dictionary alias syntax to reference primitives inside semantic tokens (for example `{color.gray.100}`).

## Token Workflow

WHEN the author adds or updates tokens:

1. The author SHALL edit JSON files under `src/primitives/`, `src/semantic/`, or `src/themes/`.
2. The author SHALL run `pnpm build` inside `packages/tokens/`.
3. The author SHALL inspect `build/css/tokens.css` to verify output custom properties.
