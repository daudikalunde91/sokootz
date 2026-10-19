/**
 * Central API client. Every page talks to the backend through here so the
 * web and mobile clients share one contract (docs/API_CONTRACTS.md).
 * Auth uses a bearer token supplied by a token provider, not cookies,
 * so the same scheme works on mobile.
 */
export type ApiErrorCode =
  | "not_configured"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "rate_limited"
  | "server";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status?: number,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function codeFromStatus(status: number): ApiErrorCode {
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  return "server";
}

export function getApiBaseUrl(): string | null {
  const url = import.meta.env["VITE_API_BASE_URL"] as string | undefined;
  return url && url.trim() ? url.replace(/\/$/, "") : null;
}

let tokenProvider: () => string | null = () => null;
export function setTokenProvider(fn: () => string | null) {
  tokenProvider = fn;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError("not_configured", "The SokoTZ marketplace service is not connected yet.");
  }
  const url = new URL(base + path);
  for (const [k, v] of Object.entries(init.query ?? {})) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const token = tokenProvider();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiError("network", "Network error. Check your connection and try again.");
  }
  if (!res.ok) {
    let body: { detail?: string; errors?: Record<string, string[]> } = {};
    try {
      body = await res.json();
    } catch {
      /* non-JSON error */
    }
    throw new ApiError(codeFromStatus(res.status), body.detail ?? `Request failed (${res.status})`, res.status, body.errors);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return "Something went wrong. Please try again.";
}
