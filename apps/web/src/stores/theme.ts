import { createSignal, type Accessor } from "solid-js";

export type Theme = "light" | "dark";

export interface ThemeStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class InMemoryStorageAdapter implements ThemeStorageAdapter {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

export class LocalStorageAdapter implements ThemeStorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore quota or disabled storage errors
    }
  }
}

export interface ThemeStoreOptions {
  storageKey?: string;
  storage?: ThemeStorageAdapter;
  onThemeChange?: (theme: Theme) => void;
  preferredColorScheme?: () => Theme;
}

export interface ThemeStore {
  theme: Accessor<Theme>;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const DEFAULT_STORAGE_KEY = "setupmoney_theme";

function defaultPreferredColorScheme(): Theme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

function defaultOnThemeChange(theme: Theme): void {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function createThemeStore(options: ThemeStoreOptions = {}): ThemeStore {
  const key = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const storage = options.storage ?? new LocalStorageAdapter();
  const getPreferred = options.preferredColorScheme ?? defaultPreferredColorScheme;
  const onThemeChange = options.onThemeChange ?? defaultOnThemeChange;

  function determineInitialTheme(): Theme {
    const saved = storage.getItem(key) as Theme | null;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return getPreferred();
  }

  const initialTheme = determineInitialTheme();
  onThemeChange(initialTheme);

  const [theme, setThemeSignal] = createSignal<Theme>(initialTheme);

  const setTheme = (nextTheme: Theme) => {
    setThemeSignal(nextTheme);
    storage.setItem(key, nextTheme);
    onThemeChange(nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme() === "dark" ? "light" : "dark");
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}

let defaultStoreInstance: ThemeStore | undefined;

export function useTheme(): ThemeStore {
  if (!defaultStoreInstance) {
    defaultStoreInstance = createThemeStore();
  }
  return defaultStoreInstance;
}
