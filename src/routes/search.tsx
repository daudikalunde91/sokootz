import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SearchBar } from "@/components/site/SearchBar";
import { ListingCard } from "@/components/site/ListingCard";
import { DataState, EmptyState, PageHeader, Skeleton } from "@/components/site/states";
import { Button } from "@/components/ui/button";
import { publicCatalogueQuery } from "@/lib/api/queries";
import { CATEGORIES, REGIONS, categoryBySlug } from "@/lib/marketplace/catalog";
import { filterListings, paginate } from "@/lib/marketplace/search";
import { useContentLang } from "@/lib/marketplace/useContentLang";
import { seo } from "@/lib/seo";

const searchSchema = z.object({
  q: z.string().max(120).optional(),
  category: z.string().max(60).optional(),
  region: z.string().max(60).optional(),
  type: z.enum(["product", "service"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () =>
    seo("Explore the marketplace", "Search businesses, products and services across Tanzania."),
  component: SearchPage,
});

function SearchPage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [lang] = useContentLang();
  const q = useQuery(publicCatalogueQuery);
  const page = q.data ? paginate(filterListings(q.data, s), s.page ?? 1) : null;
  const cat = categoryBySlug(s.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        eyebrow="Explore"
        title={
          s.q
            ? `Results for “${s.q}”`
            : cat
              ? lang === "sw"
                ? cat.nameSw
                : cat.nameEn
              : "Explore the marketplace"
        }
      />
      <div className="mb-8">
        <SearchBar key={s.q} initial={s.q ?? ""} />
      </div>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside
          aria-label="Filters"
          className="space-y-5 rounded-2xl border bg-surface p-5 md:self-start"
        >
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Type</legend>
            {(["all", "product", "service"] as const).map((t) => (
              <label key={t} className="flex min-h-9 items-center gap-2 py-1 text-sm">
                <input
                  type="radio"
                  name="type"
                  checked={(s.type ?? "all") === t}
                  onChange={() =>
                    navigate({
                      search: (p) => ({ ...p, type: t === "all" ? undefined : t, page: undefined }),
                    })
                  }
                  className="accent-primary"
                />
                {t === "all" ? "All" : t === "product" ? "Products (Bidhaa)" : "Services (Huduma)"}
              </label>
            ))}
          </fieldset>
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold">
              Category
            </label>
            <select
              id="category"
              value={s.category ?? ""}
              onChange={(e) =>
                navigate({
                  search: (p) => ({ ...p, category: e.target.value || undefined, page: undefined }),
                })
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-neon"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {lang === "sw" ? c.nameSw : c.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="region" className="mb-2 block text-sm font-semibold">
              Region
            </label>
            <select
              id="region"
              value={s.region ?? ""}
              onChange={(e) =>
                navigate({
                  search: (p) => ({ ...p, region: e.target.value || undefined, page: undefined }),
                })
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-neon"
            >
              <option value="">Tanzania Nzima (all)</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </aside>
        <section aria-live="polite">
          {q.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : q.isError ? (
            <DataState error={q.error} onRetry={() => q.refetch()} />
          ) : !page || page.count === 0 ? (
            <EmptyState
              title="No results"
              body={
                q.data.length === 0
                  ? "There are no published listings yet."
                  : "Try a different word or remove some filters."
              }
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {page.count} {page.count === 1 ? "result" : "results"}
              </p>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.results.map((l) => (
                  <li key={l.id}>
                    <ListingCard l={l} lang={lang} />
                  </li>
                ))}
              </ul>
              {page.pageCount > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-8 flex items-center justify-center gap-3"
                >
                  <Button
                    variant="outline"
                    disabled={page.page <= 1}
                    onClick={() => navigate({ search: (p) => ({ ...p, page: page.page - 1 }) })}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page.page} of {page.pageCount}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page.page >= page.pageCount}
                    onClick={() => navigate({ search: (p) => ({ ...p, page: page.page + 1 }) })}
                  >
                    Next
                  </Button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
