import { setLocale, getLocale, t } from "./index";

describe("i18n loader and translator", () => {
  it("defaults to en locale", () => {
    expect(getLocale()).toBe("en");
  });

  it("returns correct nested key translation", () => {
    expect(t("common.dashboard")).toBe("Dashboard");
    expect(t("goals.title")).toBe("Financial Goals");
  });

  it("supports switching locales dynamically", () => {
    setLocale("de");
    expect(getLocale()).toBe("de");
    expect(t("common.dashboard")).toBe("Übersicht");
    expect(t("goals.title")).toBe("Finanzielle Ziele");

    // Reset back to en
    setLocale("en");
  });

  it("falls back to key if translation missing", () => {
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });
});
