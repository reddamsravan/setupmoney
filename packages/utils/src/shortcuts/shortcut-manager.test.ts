import { describe, expect, it, vi, beforeEach } from "vitest";
import { ShortcutManager } from "./shortcut-manager";
import { SHORTCUTS } from "./registry";

function createMockKeyEvent(init: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  target?: { tagName?: string; isContentEditable?: boolean } | null;
}): Event {
  const event = new Event("keydown", { bubbles: true });
  Object.assign(event, {
    key: init.key,
    metaKey: init.metaKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    shiftKey: init.shiftKey ?? false,
    altKey: init.altKey ?? false,
  });
  Object.defineProperty(event, "target", { value: init.target ?? null, configurable: true });
  return event;
}

describe("ShortcutManager", () => {
  let target: EventTarget;

  beforeEach(() => {
    target = new EventTarget();
  });

  it("pre-compiles shortcut display keys for Mac platform", () => {
    const manager = new ShortcutManager({ isMac: true });
    manager.registerShortcut(SHORTCUTS.TOGGLE_SIDEBAR, vi.fn());

    expect(manager.getDisplayKeys("toggle-sidebar")).toBe("⌘+[");
    expect(manager.getDisplayKeys(SHORTCUTS.TOGGLE_SIDEBAR)).toBe("⌘+[");
  });

  it("pre-compiles shortcut display keys for Non-Mac platform", () => {
    const manager = new ShortcutManager({ isMac: false });
    manager.registerShortcut(SHORTCUTS.TOGGLE_SIDEBAR, vi.fn());

    expect(manager.getDisplayKeys("toggle-sidebar")).toBe("Ctrl+[");
  });

  it("delegates keydown events and triggers handler when combination matches", () => {
    const manager = new ShortcutManager({ isMac: true, target });
    const handler = vi.fn();

    manager.registerShortcut(SHORTCUTS.TOGGLE_SIDEBAR, handler);

    const matchEvent = createMockKeyEvent({
      key: "[",
      metaKey: true,
    });

    target.dispatchEvent(matchEvent);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not trigger handler when modifier keys do not match", () => {
    const manager = new ShortcutManager({ isMac: true, target });
    const handler = vi.fn();

    manager.registerShortcut(SHORTCUTS.TOGGLE_SIDEBAR, handler);

    const nonMatchEvent = createMockKeyEvent({
      key: "[",
      metaKey: false,
    });

    target.dispatchEvent(nonMatchEvent);
    expect(handler).not.toHaveBeenCalled();
  });

  it("ignores keydown events originating from editable form elements", () => {
    const manager = new ShortcutManager({ isMac: true, target });
    const handler = vi.fn();

    manager.registerShortcut(SHORTCUTS.TOGGLE_SIDEBAR, handler);

    const event = createMockKeyEvent({
      key: "[",
      metaKey: true,
      target: { tagName: "INPUT" },
    });

    target.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("allows unregistering a shortcut handler", () => {
    const manager = new ShortcutManager({ isMac: true, target });
    const handler = vi.fn();

    const unregister = manager.registerShortcut(SHORTCUTS.TOGGLE_SIDEBAR, handler);
    unregister();

    const event = createMockKeyEvent({
      key: "[",
      metaKey: true,
    });

    target.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });
});
