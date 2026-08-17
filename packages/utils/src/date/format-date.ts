export type DateFormatPreset = "short" | "full" | "relative";

export interface FormatDateOptions {
  format?: DateFormatPreset;
  locale?: string;
}

export function formatDate(
  dateInput: Date | string | number,
  options: FormatDateOptions = {},
): string {
  const { format = "short", locale = "en-US" } = options;
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);

  if (format === "relative") {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === -1) return "yesterday";
    if (diffDays === 1) return "tomorrow";

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    return rtf.format(diffDays, "day");
  }

  if (format === "full") {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
