---
name: add-component
description: >-
  Step-by-step guide for scaffolding a new SolidJS component in @setupmoney/components.
  Enforces kebab-case file naming, co-located CSS Modules, token consumption, barrel export, and tsdown build verification.
---

# Add Component Skill

Follow this guide to create a new SolidJS component in `@setupmoney/components`.

---

## 1. Directory & File Placement

All components live under `packages/components/src/` categorized into one of three directories:

- `src/forms/` — Form controls (e.g. `button.tsx`, `input.tsx`, `select.tsx`, `checkbox.tsx`)
- `src/layout/` — Structural layout (e.g. `card.tsx`, `sidebar.tsx`, `table.tsx`)
- `src/feedback/` — Overlays & indicators (e.g. `badge.tsx`, `modal.tsx`, `spinner.tsx`, `toast.tsx`, `avatar.tsx`)

Every component consists of two co-located files using `kebab-case`:

- Component logic: `src/<category>/<name>.tsx`
- Component styles: `src/<category>/<name>.module.css`

---

## 2. Component Template (`.tsx`)

```tsx
import type { Component, ComponentProps } from 'solid-js';
import styles from './<name>.module.css';

export interface <ComponentName>Props extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export const <ComponentName>: Component<<ComponentName>Props> = (props) => {
  return (
    <button class={styles.root} {...props}>
      {props.children}
    </button>
  );
};
```

---

## 3. Style Module Template (`.module.css`)

CSS Module classes MUST use `camelCase` and consume CSS custom properties from `@setupmoney/tokens`:

```css
.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-16);
  border-radius: var(--border-radius-md);
  font-family: inherit;
}
```

---

## 4. Re-exporting from Barrel File

Add the component export to `packages/components/src/index.ts`:

```ts
export * from "./<category>/<name>";
```

---

## 5. Build Verification

Build the package using `tsdown`:

```bash
cd packages/components
pnpm build
```

---

## 6. Helper Script

You can also run the scaffolding helper script:

```bash
node .agents/skills/add-component/scripts/scaffold-component.js <category> <component-kebab-name>
```

Example:

```bash
node .agents/skills/add-component/scripts/scaffold-component.js forms button
```
