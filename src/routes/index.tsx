import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, MessageCircle, Sparkles, Store } from "lucide-react";
import { SearchBar } from "@/components/site/SearchBar";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { ListingCard } from "@/components/site/ListingCard";
import { DataState, PlannedBadge, Skeleton } from "@/components/site/states";
import { Button } from "@/components/ui/button";
import { publicCatalogueQuery } from "@/lib/api/queries";
import { filterListings } from "@/lib/marketplace/search";
import { useContentLang } from "@/lib/marketplace/useContentLang";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SokoTZ — Find businesses, products & services in Tanzania" },
      {
        name: "description",
        content:
          "Search Tanzanian businesses, products and services, and contact sellers directly.",
      },
      {
        property: "og:title",
        content: "SokoTZ — Find businesses, products & services in Tanzania",
      },
      {
        property: "og:description",
        content:
          "Search Tanzanian businesses, products and services, and contact sellers directly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const listings = useQuery(publicCatalogueQuery);
  const [lang] = useContentLang();
  const latest = listings.data ? filterListings(listings.data, {}).slice(0, 8) : [];
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 text-center md:pb-16 md:pt-28">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-surface/70 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-neon" aria-hidden /> Tanzania-first marketplace
        </p>
        <h1 className="text-4xl font-extrabold leading-[1.05] md:text-7xl">
          Find what you need, <span className="text-gradient-neon">from people near you.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Discover local businesses, products and services, then contact them directly.
        </p>
        <div className="mx-auto mt-10 max-w-2xl">
          <SearchBar large />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6" aria-labelledby="cat-h">
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 id="cat-h" className="min-w-0 text-xl font-bold sm:text-2xl">
            Browse categories
          </h2>
          <Link to="/categories" className="py-3 text-sm text-neon hover:underline">
            All categories
          </Link>
        </div>
        <CategoryGrid />
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6" aria-labelledby="latest-h">
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 id="latest-h" className="min-w-0 text-xl font-bold sm:text-2xl">
            Latest listings
          </h2>
          <Link to="/search" className="py-3 text-sm text-neon hover:underline">
            See all
          </Link>
        </div>
        {listings.isPending ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : listings.isError ? (
          <DataState error={listings.error} onRetry={() => listings.refetch()} />
        ) : latest.length === 0 ? (
          <p className="rounded-2xl border border-dashed bg-surface/60 p-6 text-center text-sm text-muted-foreground">
            No published listings yet. Be the first to list your business.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latest.map((l) => (
              <li key={l.id}>
                <ListingCard l={l} lang={lang} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-6">
        {[
          {
            icon: Store,
            t: "Real local businesses",
            b: "Every listing belongs to a real business profile.",
          },
          {
            icon: MessageCircle,
            t: "Contact directly",
            b: "Call or message sellers using their published details.",
          },
          {
            icon: BadgeCheck,
            t: "Verification",
            b: "A Verified badge appears only after SokoTZ staff check a business. The staff review process is still being set up.",
            planned: true,
          },
        ].map(({ icon: Icon, t, b, planned }) => (
          <div key={t} className="rounded-2xl border bg-surface p-6 shadow-card">
            <Icon className="mb-4 size-6 text-neon" aria-hidden />
            <h3 className="flex flex-wrap items-center gap-2 font-semibold">
              {t} {planned && <PlannedBadge />}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border bg-gradient-primary p-5 sm:p-8 lg:flex-row lg:items-center lg:p-12">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Run a business in Tanzania?
            </h2>
            <p className="mt-2 text-primary-foreground/85">
              Create a free business profile and list your products and services on SokoTZ.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 lg:shrink-0">
            <Button asChild variant="secondary" size="lg">
              <Link to="/dashboard">List your business</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-primary-foreground">
              <Link to="/assistant">
                <Sparkles aria-hidden /> Assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
