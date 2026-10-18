import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SearchBar } from "@/components/site/SearchBar";
import { DataState, EmptyState, PageHeader, Skeleton } from "@/components/site/states";
import { listingsService } from "@/lib/api/services";
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
  head: () => seo("Explore the marketplace", "Search businesses, products and services across Tanzania."),
  component: SearchPage,
});

function SearchPage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const q = useQuery({ queryKey: ["listings", s], queryFn: () => listingsService.search(s), retry: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader eyebrow="Explore" title={s.q ? `Results for “${s.q}”` : "Explore the marketplace"} />
      <div className="mb-8"><SearchBar key={s.q} initial={s.q ?? ""} /></div>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="space-y-5 rounded-2xl border bg-surface p-5 md:self-start">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Type</legend>
            {(["all", "product", "service"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 py-1 text-sm capitalize">
                <input
                  type="radio"
                  name="type"
                  checked={(s.type ?? "all") === t}
                  onChange={() => navigate({ search: (p) => ({ ...p, type: t === "all" ? undefined : t, page: undefined }) })}
                  className="accent-primary"
                />
                {t === "all" ? "All" : t + "s"}
              </label>
            ))}
          </fieldset>
          <div>
            <label htmlFor="region" className="mb-2 block text-sm font-semibold">Region</label>
            <input
              id="region"
              defaultValue={s.region}
              placeholder="e.g. Dar es Salaam"
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate({ search: (p) => ({ ...p, region: e.currentTarget.value.trim() || undefined, page: undefined }) });
              }}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-neon"
            />
            <p className="mt-1 text-xs text-muted-foreground">Press Enter to apply.</p>
          </div>
        </aside>
        <section aria-live="polite">
          {q.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}</div>
          ) : q.isError ? (
            <DataState error={q.error} />
          ) : q.data.results.length === 0 ? (
            <EmptyState title="No results" body="Try a different word or remove some filters." />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {q.data.results.map((l) => (
                <li key={l.id}>
                  <Link to="/listing/$id" params={{ id: l.id }} className="block rounded-2xl border bg-surface p-4 hover:border-neon">
                    <h3 className="font-semibold">{l.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{l.business.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
