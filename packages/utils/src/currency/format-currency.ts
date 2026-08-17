export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
}

export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const { currency = "USD", locale = "en-US" } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
