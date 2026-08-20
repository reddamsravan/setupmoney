import { createSignal } from "solid-js";
import { setLocale as setI18nLocale, type SupportedLocale } from "@setupmoney/i18n";

const STORAGE_KEY = "setupmoney_locale";

function getInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
  if (saved && (saved === "en" || saved === "de")) {
    return saved;
  }
  const navLang = navigator.language.slice(0, 2);
  if (navLang === "de") return "de";
  return "en";
}

const initial = getInitialLocale();
setI18nLocale(initial);
if (typeof document !== "undefined") {
  document.documentElement.lang = initial;
}

const [currentLocale, setCurrentLocaleSignal] = createSignal<SupportedLocale>(initial);

export function useLocale() {
  const setLocale = (locale: SupportedLocale) => {
    setCurrentLocaleSignal(locale);
    setI18nLocale(locale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    }
  };

  return {
    locale: currentLocale,
    setLocale,
  };
}
