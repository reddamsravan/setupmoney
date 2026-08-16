export type ShortcutCategory = "navigation" | "actions" | "modal";

export interface ShortcutDefinition {
  id: string;
  keys: {
    mac: string;
    default: string;
  };
  label: string;
  category: ShortcutCategory;
}

export const SHORTCUTS: Record<string, ShortcutDefinition> = {
  TOGGLE_SIDEBAR: {
    id: "toggle-sidebar",
    keys: {
      mac: "Meta+[",
      default: "Control+[",
    },
    label: "Toggle Sidebar",
    category: "navigation",
  },
} as const;
