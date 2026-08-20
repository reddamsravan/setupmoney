import type { ShortcutDefinition } from "./registry";

export interface ShortcutListenerOptions {
  preventDefault?: boolean;
}

export function registerShortcutListener(
  shortcut: ShortcutDefinition,
  handler: (e: KeyboardEvent) => void,
  options: ShortcutListenerOptions = { preventDefault: true },
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable)
    ) {
      return;
    }

    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const targetCombo = isMac ? shortcut.keys.mac : shortcut.keys.default;

    const parts = targetCombo.split("+");
    const keyNeeded = parts[parts.length - 1] ?? "";
    const needsMeta = parts.includes("Meta");
    const needsCtrl = parts.includes("Control");
    const needsShift = parts.includes("Shift");
    const needsAlt = parts.includes("Alt");

    if (
      keyNeeded &&
      event.key.toLowerCase() === keyNeeded.toLowerCase() &&
      event.metaKey === needsMeta &&
      event.ctrlKey === needsCtrl &&
      event.shiftKey === needsShift &&
      event.altKey === needsAlt
    ) {
      if (options.preventDefault !== false) {
        event.preventDefault();
      }
      handler(event);
    }
  };

  window.addEventListener("keydown", listener);

  return () => {
    window.removeEventListener("keydown", listener);
  };
}
