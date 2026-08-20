import type { ShortcutDefinition } from "./registry";

export interface ShortcutListenerOptions {
  preventDefault?: boolean;
}

export interface CompiledShortcut {
  definition: ShortcutDefinition;
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  displayKeys: string;
}

export interface ShortcutHandlerRegistration {
  id: string;
  handler: (e: KeyboardEvent) => void;
  options: ShortcutListenerOptions;
}

export interface ShortcutManagerOptions {
  isMac?: boolean;
  target?: EventTarget;
}

export interface EditableElementLike {
  tagName?: string;
  isContentEditable?: boolean;
}

export interface ShortcutEventLike {
  key?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  target?: EditableElementLike | null;
  preventDefault?: () => void;
}

function detectIsMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
}

export function compileShortcut(definition: ShortcutDefinition, isMac: boolean): CompiledShortcut {
  const rawKey = isMac ? definition.keys.mac : definition.keys.default;
  const parts = rawKey.split("+");
  const keyNeeded = (parts[parts.length - 1] ?? "").toLowerCase();

  const needsMeta = parts.includes("Meta");
  const needsCtrl = parts.includes("Control");
  const needsShift = parts.includes("Shift");
  const needsAlt = parts.includes("Alt");

  const displayKeys = rawKey
    .replace("Meta", "⌘")
    .replace("Control", "Ctrl")
    .replace("Shift", "⇧")
    .replace("Alt", "⌥");

  return {
    definition,
    key: keyNeeded,
    metaKey: needsMeta,
    ctrlKey: needsCtrl,
    shiftKey: needsShift,
    altKey: needsAlt,
    displayKeys,
  };
}

export function isEditableElement(element: EditableElementLike | null | undefined): boolean {
  if (!element) return false;
  const tagName = element.tagName ? element.tagName.toUpperCase() : "";
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    Boolean(element.isContentEditable)
  );
}

export class ShortcutManager {
  private readonly isMac: boolean;
  private readonly target: EventTarget | null;
  private readonly compiledShortcuts = new Map<string, CompiledShortcut>();
  private readonly handlers = new Map<string, Set<ShortcutHandlerRegistration>>();
  private isListening = false;

  constructor(options: ShortcutManagerOptions = {}) {
    this.isMac = options.isMac ?? detectIsMac();
    this.target = options.target ?? (typeof window !== "undefined" ? window : null);
  }

  private handleKeyDown = (event: Event) => {
    const e = event as unknown as ShortcutEventLike;
    if (!e.key) return;

    if (isEditableElement(e.target)) return;

    const eventKey = e.key.toLowerCase();
    const metaKey = Boolean(e.metaKey);
    const ctrlKey = Boolean(e.ctrlKey);
    const shiftKey = Boolean(e.shiftKey);
    const altKey = Boolean(e.altKey);

    for (const [id, compiled] of this.compiledShortcuts.entries()) {
      if (
        compiled.key === eventKey &&
        metaKey === compiled.metaKey &&
        ctrlKey === compiled.ctrlKey &&
        shiftKey === compiled.shiftKey &&
        altKey === compiled.altKey
      ) {
        const registrations = this.handlers.get(id);
        if (registrations && registrations.size > 0) {
          for (const reg of registrations) {
            if (reg.options.preventDefault !== false && typeof e.preventDefault === "function") {
              e.preventDefault();
            }
            reg.handler(event as KeyboardEvent);
          }
        }
      }
    }
  };

  private ensureListener() {
    if (!this.isListening && this.target) {
      this.target.addEventListener("keydown", this.handleKeyDown);
      this.isListening = true;
    }
  }

  public registerShortcut(
    shortcut: ShortcutDefinition,
    handler: (e: KeyboardEvent) => void,
    options: ShortcutListenerOptions = { preventDefault: true },
  ): () => void {
    const id = shortcut.id;

    if (!this.compiledShortcuts.has(id)) {
      this.compiledShortcuts.set(id, compileShortcut(shortcut, this.isMac));
    }

    if (!this.handlers.has(id)) {
      this.handlers.set(id, new Set());
    }

    const reg: ShortcutHandlerRegistration = { id, handler, options };
    this.handlers.get(id)!.add(reg);

    this.ensureListener();

    return () => {
      const regSet = this.handlers.get(id);
      if (regSet) {
        regSet.delete(reg);
        if (regSet.size === 0) {
          this.handlers.delete(id);
        }
      }
    };
  }

  public getDisplayKeys(shortcut: string | ShortcutDefinition): string {
    const def = typeof shortcut === "string" ? undefined : shortcut;
    const id = typeof shortcut === "string" ? shortcut : shortcut.id;

    if (this.compiledShortcuts.has(id)) {
      return this.compiledShortcuts.get(id)!.displayKeys;
    }

    if (def) {
      const compiled = compileShortcut(def, this.isMac);
      this.compiledShortcuts.set(id, compiled);
      return compiled.displayKeys;
    }

    return id;
  }

  public destroy() {
    if (this.isListening && this.target) {
      this.target.removeEventListener("keydown", this.handleKeyDown);
      this.isListening = false;
    }
    this.compiledShortcuts.clear();
    this.handlers.clear();
  }
}

let globalShortcutManager: ShortcutManager | undefined;

export function getGlobalShortcutManager(): ShortcutManager {
  if (!globalShortcutManager) {
    globalShortcutManager = new ShortcutManager();
  }
  return globalShortcutManager;
}

export function createShortcutManager(options?: ShortcutManagerOptions): ShortcutManager {
  return new ShortcutManager(options);
}
