---
name: add-token
description: Step-by-step guide for adding or updating Style Dictionary design tokens in @setupmoney/tokens
---

# `add-token` Skill

Use this skill when adding or updating design tokens in `@setupmoney/tokens`.

---

## 4-Step Token Workflow

### Step 1: Add or Update Primitive Tokens

Primitives define raw values (scales, colors, measurements). Place them in `packages/tokens/src/primitives/<category>.json`.

Example (`packages/tokens/src/primitives/color.json`):
```json
{
  "color": {
    "blue": {
      "600": { "value": "oklch(0.62 0.22 255)", "type": "color" }
    }
  }
}
```

### Step 2: Add or Update Semantic Tokens

Semantic tokens assign intent/context by referencing primitive tokens using Style Dictionary alias syntax (`{category.subcategory.item}`). Place them in `packages/tokens/src/semantic/<category>.json`.

Example (`packages/tokens/src/semantic/color.json`):
```json
{
  "color": {
    "background": {
      "primary": { "value": "{color.blue.600}", "type": "color" }
    }
  }
}
```

### Step 3: Add Theme Overrides (Optional)

If the token varies between light and dark modes, add overrides in `packages/tokens/src/themes/light.json` or `packages/tokens/src/themes/dark.json`.

Example (`packages/tokens/src/themes/dark.json`):
```json
{
  "color": {
    "background": {
      "primary": { "value": "{color.gray.900}", "type": "color" }
    }
  }
}
```

### Step 4: Rebuild Tokens and Verify

Always rebuild tokens immediately after editing token JSON files:

```bash
cd packages/tokens
pnpm build
```

Verify that the output file `packages/tokens/build/css/tokens.css` contains the expected CSS custom property format:
`--color-background-primary: oklch(0.62 0.22 255);`

---

## Naming Conventions & Rules

- **Color Format**: ALL color tokens MUST use the **OKLCH** color format (e.g. `oklch(0.62 0.22 255)` or `oklch(0.62 0.22 255 / 0.5)`). Hex, RGB, or HSL are strictly prohibited.
- **Unit Standard**: Dimension-based primitive tokens (spacing, sizing, typography, borders, breakpoints) MUST use **`rem`** units.
- **Primitives Structure**: Organized in flat category files under `packages/tokens/src/primitives/<category>.json` (e.g. `color.json`, `spacing.json`, `typography.json`).
- **Spacing & Sizing Scale**: Primitive spacing/sizing tokens use numeric pixel-equivalent keys (e.g. `"4": { "value": "0.25rem" }`, `"16": { "value": "1rem" }`).
- **Semantic Tokens**: Named by intent and role (e.g. `color.background.primary`, `typography.body.size`).
- **Generated CSS Variables**: Formatted as `--<category>-<subcategory>-<item>` without brand prefixes.
- **Strict Build Rule**: Never leave source token changes uncompiled.
