import type { ShortcutDefinition } from "./registry";
import { getGlobalShortcutManager, type ShortcutListenerOptions } from "./shortcut-manager";

export type { ShortcutListenerOptions };

export function registerShortcutListener(
  shortcut: ShortcutDefinition,
  handler: (e: KeyboardEvent) => void,
  options?: ShortcutListenerOptions,
): () => void {
  return getGlobalShortcutManager().registerShortcut(shortcut, handler, options);
}
