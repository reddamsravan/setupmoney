import { createQuery } from "@tanstack/solid-query";
import { api, type ReportFilterParams } from "@setupmoney/api";

export function useReportsSummaryQuery(params: () => ReportFilterParams | undefined) {
  return createQuery(() => ({
    queryKey: api.reports.keys.summary(params()),
    queryFn: ({ signal }) => api.reports.summary(params(), { signal }),
  }));
}
