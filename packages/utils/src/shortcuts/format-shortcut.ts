import type { ShortcutDefinition } from "./registry";
import { getGlobalShortcutManager } from "./shortcut-manager";

export function formatShortcut(shortcut: ShortcutDefinition): string {
  return getGlobalShortcutManager().getDisplayKeys(shortcut);
}
