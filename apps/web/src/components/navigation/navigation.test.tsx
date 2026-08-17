import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./navigation";
import { t } from "@setupmoney/i18n";

describe("navigation", () => {
  it("uses i18n key translations for nav item labels", () => {
    NAV_ITEMS.forEach((item) => {
      const label = item.getLabel();
      expect(label).toBe(t(`common.${item.key}`));
    });
  });
});
