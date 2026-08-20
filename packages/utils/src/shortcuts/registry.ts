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

export const SHORTCUTS = {
  TOGGLE_SIDEBAR: {
    id: "toggle-sidebar",
    keys: {
      mac: "Meta+[",
      default: "Control+[",
    },
    label: "Toggle Sidebar",
    category: "navigation",
  },
} as const satisfies Record<string, ShortcutDefinition>;
