import type { ApiErrorResponse } from "./types";

export class ApiError extends Error {
  public readonly status: number;
  public readonly data?: ApiErrorResponse;

  constructor(status: number, message: string, data?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

import type {
  Account,
  CreateAccountDTO,
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilterParams,
  BudgetCategory,
  UpdateBudgetDTO,
  Goal,
  CreateGoalDTO,
  UpdateGoalDTO,
  Asset,
  CreateAssetDTO,
  UpdateAssetDTO,
  SummaryReport,
  ReportFilterParams,
} from "./types";

export interface ApiClientConfig {
  basePath?: string;
  fetcher?: typeof fetch;
}

export function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}

export function createApiClient(config: ApiClientConfig = {}) {
  const basePath = config.basePath ?? "/api/v1";

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    const fullUrl = `${basePath}${path}`;
    const activeFetcher = config.fetcher ?? globalThis.fetch;
    const response = await activeFetcher(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: ApiErrorResponse | undefined;
      try {
        errorData = (await response.json()) as ApiErrorResponse;
      } catch {
        // Non-JSON fallback
      }
      const message =
        errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(response.status, message, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  function get<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: "GET" });
  }

  function post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  function put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  function del<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: "DELETE" });
  }

  const accountKeys = {
    all: ["accounts"] as const,
    lists: () => [...accountKeys.all, "list"] as const,
    list: () => [...accountKeys.all, "list"] as const,
    detail: (id: string) => [...accountKeys.all, "detail", id] as const,
  };

  const transactionKeys = {
    all: ["transactions"] as const,
    lists: () => [...transactionKeys.all, "list"] as const,
    list: (params?: TransactionFilterParams) => [...transactionKeys.lists(), params ?? {}] as const,
    detail: (id: string) => [...transactionKeys.all, "detail", id] as const,
  };

  const budgetKeys = {
    all: ["budget"] as const,
    lists: () => [...budgetKeys.all, "list"] as const,
    list: () => [...budgetKeys.all, "list"] as const,
    detail: (category: string) => [...budgetKeys.all, "detail", category] as const,
  };

  const goalKeys = {
    all: ["goals"] as const,
    lists: () => [...goalKeys.all, "list"] as const,
    list: () => [...goalKeys.all, "list"] as const,
    detail: (id: string) => [...goalKeys.all, "detail", id] as const,
  };

  const assetKeys = {
    all: ["assets"] as const,
    lists: () => [...assetKeys.all, "list"] as const,
    list: () => [...assetKeys.all, "list"] as const,
    detail: (id: string) => [...assetKeys.all, "detail", id] as const,
  };

  const reportKeys = {
    all: ["reports"] as const,
    summary: (params?: ReportFilterParams) => [...reportKeys.all, "summary", params ?? {}] as const,
  };

  return {
    accounts: {
      keys: accountKeys,
      list: (options?: RequestInit) => get<Account[]>("/accounts", options),
      detail: (id: string, options?: RequestInit) => get<Account>(`/accounts/${id}`, options),
      create: (data: CreateAccountDTO, options?: RequestInit) =>
        post<Account>("/accounts", data, options),
    },

    transactions: {
      keys: transactionKeys,
      list: (params?: TransactionFilterParams, options?: RequestInit) =>
        get<Transaction[]>(`/transactions${buildQueryString(params)}`, options),
      detail: (id: string, options?: RequestInit) =>
        get<Transaction>(`/transactions/${id}`, options),
      create: (data: CreateTransactionDTO, options?: RequestInit) =>
        post<Transaction>("/transactions", data, options),
      update: (id: string, data: UpdateTransactionDTO, options?: RequestInit) =>
        put<Transaction>(`/transactions/${id}`, data, options),
      delete: (id: string, options?: RequestInit) => del<void>(`/transactions/${id}`, options),
    },

    budget: {
      keys: budgetKeys,
      list: (options?: RequestInit) => get<BudgetCategory[]>("/budget", options),
      detail: (category: string, options?: RequestInit) =>
        get<BudgetCategory>(`/budget/${encodeURIComponent(category)}`, options),
      update: (data: UpdateBudgetDTO, options?: RequestInit) =>
        put<BudgetCategory>("/budget", data, options),
    },

    goals: {
      keys: goalKeys,
      list: (options?: RequestInit) => get<Goal[]>("/goals", options),
      detail: (id: string, options?: RequestInit) => get<Goal>(`/goals/${id}`, options),
      create: (data: CreateGoalDTO, options?: RequestInit) => post<Goal>("/goals", data, options),
      update: (id: string, data: UpdateGoalDTO, options?: RequestInit) =>
        put<Goal>(`/goals/${id}`, data, options),
      delete: (id: string, options?: RequestInit) => del<void>(`/goals/${id}`, options),
    },

    assets: {
      keys: assetKeys,
      list: (options?: RequestInit) => get<Asset[]>("/assets", options),
      detail: (id: string, options?: RequestInit) => get<Asset>(`/assets/${id}`, options),
      create: (data: CreateAssetDTO, options?: RequestInit) =>
        post<Asset>("/assets", data, options),
      update: (id: string, data: UpdateAssetDTO, options?: RequestInit) =>
        put<Asset>(`/assets/${id}`, data, options),
      delete: (id: string, options?: RequestInit) => del<void>(`/assets/${id}`, options),
    },

    reports: {
      keys: reportKeys,
      summary: (params?: ReportFilterParams, options?: RequestInit) =>
        get<SummaryReport>(`/reports${buildQueryString(params)}`, options),
    },
  };
}

export const api = createApiClient();
export type ApiClient = ReturnType<typeof createApiClient>;
