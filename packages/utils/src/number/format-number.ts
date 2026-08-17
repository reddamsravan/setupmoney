export type NumberFormatStyle = "decimal" | "percent";

export interface FormatNumberOptions {
  style?: NumberFormatStyle;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}

export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
  const {
    style = "decimal",
    minimumFractionDigits,
    maximumFractionDigits,
    locale = "en-US",
  } = options;

  const defaultMaxFraction = style === "percent" ? 1 : 2;
  const defaultMinFraction = 0;

  return new Intl.NumberFormat(locale, {
    style,
    minimumFractionDigits: minimumFractionDigits ?? defaultMinFraction,
    maximumFractionDigits: maximumFractionDigits ?? defaultMaxFraction,
  }).format(value);
}
