import type { ShortcutDefinition } from "./registry";

export function formatShortcut(shortcut: ShortcutDefinition): string {
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const rawKey = isMac ? shortcut.keys.mac : shortcut.keys.default;

  return rawKey
    .replace("Meta", "⌘")
    .replace("Control", "Ctrl")
    .replace("Shift", "⇧")
    .replace("Alt", "⌥");
}
