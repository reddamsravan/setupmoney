import type { TransactionFilterParams, ReportFilterParams } from "@setupmoney/api";

export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  detail: (id: string) => [...accountKeys.all, "detail", id] as const,
};

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params?: TransactionFilterParams) => [...transactionKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...transactionKeys.all, "detail", id] as const,
};

export const budgetKeys = {
  all: ["budget"] as const,
  lists: () => [...budgetKeys.all, "list"] as const,
  detail: (category: string) => [...budgetKeys.all, "detail", category] as const,
};

export const goalKeys = {
  all: ["goals"] as const,
  lists: () => [...goalKeys.all, "list"] as const,
  detail: (id: string) => [...goalKeys.all, "detail", id] as const,
};

export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  detail: (id: string) => [...assetKeys.all, "detail", id] as const,
};

export const reportKeys = {
  all: ["reports"] as const,
  summary: (params?: ReportFilterParams) => [...reportKeys.all, "summary", params ?? {}] as const,
};
