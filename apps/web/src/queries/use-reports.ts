import { createQuery } from "@tanstack/solid-query";
import { apiService, type ReportFilterParams } from "@setupmoney/api";
import { reportKeys } from "./query-keys";

export function useReportsSummaryQuery(params: () => ReportFilterParams | undefined) {
  return createQuery(() => ({
    queryKey: reportKeys.summary(params()),
    queryFn: ({ signal }) => apiService.reports.summary(params(), { signal }),
  }));
}
