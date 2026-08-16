import { describe, expect, it, vi } from "vitest";
import { SHORTCUTS } from "../src/shortcuts/registry";
import { formatShortcut } from "../src/shortcuts/format-shortcut";
import { registerShortcutListener } from "../src/shortcuts/listener";

describe("shortcuts/registry", () => {
  it("defines TOGGLE_SIDEBAR shortcut correctly", () => {
    expect(SHORTCUTS.TOGGLE_SIDEBAR).toBeDefined();
    expect(SHORTCUTS.TOGGLE_SIDEBAR.id).toBe("toggle-sidebar");
    expect(SHORTCUTS.TOGGLE_SIDEBAR.keys.mac).toBe("Meta+[");
    expect(SHORTCUTS.TOGGLE_SIDEBAR.keys.default).toBe("Control+[");
  });
});

describe("shortcuts/format-shortcut", () => {
  it("formats shortcuts with readable symbols", () => {
    const formatted = formatShortcut(SHORTCUTS.TOGGLE_SIDEBAR);
    expect(formatted).toMatch(/⌘\[|Ctrl\+\[/);
  });
});

describe("shortcuts/listener", () => {
  it("registers listener and cleans up on unregister", () => {
    const handler = vi.fn();
    const cleanup = registerShortcutListener(SHORTCUTS.TOGGLE_SIDEBAR, handler);

    expect(typeof cleanup).toBe("function");
    cleanup();
  });
});
