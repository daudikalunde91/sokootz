import { listingsService } from "./services";

/** Shared cache key for the bounded public catalogue (search, home, Assistant). */
export const publicCatalogueQuery = {
  queryKey: ["listings", "public"],
  queryFn: listingsService.publicCatalogue,
  retry: false,
  staleTime: 60_000,
} as const;
