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

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | undefined;
    try {
      errorData = (await response.json()) as ApiErrorResponse;
    } catch {
      // Non-JSON response body (e.g. 500 HTML error pages or 502 Bad Gateway proxies); fallback to statusText
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

export const Api = {
  get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return apiFetch<T>(path, { ...options, method: "GET" });
  },

  post<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    return apiFetch<T>(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    return apiFetch<T>(path, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    return apiFetch<T>(path, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return apiFetch<T>(path, { ...options, method: "DELETE" });
  },
};
