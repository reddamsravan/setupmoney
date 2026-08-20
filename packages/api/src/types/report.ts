export interface SummaryReport {
  totalNetWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface ReportFilterParams {
  period?: string;
  compareYear?: number;
}
