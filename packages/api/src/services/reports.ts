import { Api } from "../client";
import { Endpoints } from "../endpoints";
import type { SummaryReport, ReportFilterParams } from "../types";

export const reportsApi = {
  summary: (params?: ReportFilterParams, options?: RequestInit) =>
    Api.get<SummaryReport>(Endpoints.reports.summary(params), options),
};
