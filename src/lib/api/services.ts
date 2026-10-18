/**
 * Feature services — the only place pages get marketplace data.
 * Paths are PROPOSED (docs/API_CONTRACTS.md). Until VITE_API_BASE_URL is set,
 * every call rejects with ApiError("not_configured"); no fake data is returned.
 */
import { apiRequest } from "./client";
import type { BusinessProfile, Category, Listing, Page, SearchParams } from "./types";

export const categoriesService = {
  list: () => apiRequest<Page<Category>>("/v1/categories/"),
};

export const listingsService = {
  search: (p: SearchParams) =>
    apiRequest<Page<Listing>>("/v1/listings/", { query: { ...p } }),
  get: (id: string) => apiRequest<Listing>(`/v1/listings/${encodeURIComponent(id)}/`),
};

export const businessesService = {
  get: (slug: string) => apiRequest<BusinessProfile>(`/v1/businesses/${encodeURIComponent(slug)}/`),
};

export const authService = {
  login: (body: { email: string; password: string }) =>
    apiRequest<{ access: string; refresh: string }>("/v1/auth/login/", { method: "POST", body: JSON.stringify(body) }),
  register: (body: { name: string; email: string; password: string }) =>
    apiRequest<void>("/v1/auth/register/", { method: "POST", body: JSON.stringify(body) }),
  requestPasswordReset: (body: { email: string }) =>
    apiRequest<void>("/v1/auth/password-reset/", { method: "POST", body: JSON.stringify(body) }),
  confirmPasswordReset: (body: { token: string; password: string }) =>
    apiRequest<void>("/v1/auth/password-reset/confirm/", { method: "POST", body: JSON.stringify(body) }),
};
