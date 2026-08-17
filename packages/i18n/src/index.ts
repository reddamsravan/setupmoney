import en from "./locales/en.json";
import de from "./locales/de.json";

export type SupportedLocale = "en" | "de";

const dictionaries: Record<SupportedLocale, Record<string, any>> = {
  en,
  de,
};

let currentLocale: SupportedLocale = "en";

export function setLocale(locale: SupportedLocale): void {
  if (dictionaries[locale]) {
    currentLocale = locale;
  }
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function getTranslation(key: string, locale: SupportedLocale = currentLocale): string {
  const dict = dictionaries[locale] || dictionaries.en;
  const parts = key.split(".");
  let val: any = dict;

  for (const part of parts) {
    if (val && typeof val === "object" && part in val) {
      val = val[part];
    } else {
      return key;
    }
  }

  return typeof val === "string" ? val : key;
}

export function t(key: string): string {
  return getTranslation(key, currentLocale);
}
