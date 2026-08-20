export const API_BASE_PATH = "/api/v1";

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export function buildQueryString(params?: QueryParams): string {
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

export const Endpoints = {
  accounts: {
    list: () => `${API_BASE_PATH}/accounts`,
    detail: (id: string) => `${API_BASE_PATH}/accounts/${id}`,
  },
  transactions: {
    list: <TParams extends QueryParams = QueryParams>(params?: TParams) =>
      `${API_BASE_PATH}/transactions${buildQueryString(params)}`,
    detail: (id: string) => `${API_BASE_PATH}/transactions/${id}`,
  },
  budget: {
    list: () => `${API_BASE_PATH}/budget`,
    detail: (category: string) => `${API_BASE_PATH}/budget/${encodeURIComponent(category)}`,
  },
  goals: {
    list: () => `${API_BASE_PATH}/goals`,
    detail: (id: string) => `${API_BASE_PATH}/goals/${id}`,
  },
  assets: {
    list: () => `${API_BASE_PATH}/assets`,
    detail: (id: string) => `${API_BASE_PATH}/assets/${id}`,
  },
  reports: {
    summary: <TParams extends QueryParams = QueryParams>(params?: TParams) =>
      `${API_BASE_PATH}/reports${buildQueryString(params)}`,
  },
};
