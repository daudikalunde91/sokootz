import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, MessageCircle, Sparkles, Store } from "lucide-react";
import { SearchBar } from "@/components/site/SearchBar";
import { DataState, PlannedBadge, Skeleton } from "@/components/site/states";
import { Button } from "@/components/ui/button";
import { categoriesService } from "@/lib/api/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SokoTZ — Find businesses, products & services in Tanzania" },
      { name: "description", content: "Search Tanzanian businesses, products and services, and contact sellers directly." },
      { property: "og:title", content: "SokoTZ — Find businesses, products & services in Tanzania" },
      { property: "og:description", content: "Search Tanzanian businesses, products and services, and contact sellers directly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const cats = useQuery({ queryKey: ["categories"], queryFn: categoriesService.list, retry: false });
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center md:pt-28">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-surface/70 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-neon" aria-hidden /> Tanzania-first marketplace
        </p>
        <h1 className="text-4xl font-extrabold leading-[1.05] md:text-7xl">
          Find what you need, <span className="text-gradient-neon">from people near you.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Discover local businesses, products and services, then contact them directly.
        </p>
        <div className="mx-auto mt-10 max-w-2xl"><SearchBar large /></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6" aria-labelledby="cat-h">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="cat-h" className="text-2xl font-bold">Browse categories</h2>
          <Link to="/categories" className="text-sm text-neon hover:underline">All categories</Link>
        </div>
        {cats.isPending ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : cats.isError ? (
          <DataState error={cats.error} />
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {cats.data.results.map((c) => (
              <li key={c.id}><Link to="/search" search={{ category: c.slug }} className="block rounded-xl border bg-surface p-5 hover:border-neon">{c.name}</Link></li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-6">
        {[
          { icon: Store, t: "Real local businesses", b: "Every listing belongs to a real business profile." },
          { icon: MessageCircle, t: "Contact directly", b: "Call or message sellers using their published details." },
          { icon: BadgeCheck, t: "Verification", b: "Business verification is planned for launch.", planned: true },
        ].map(({ icon: Icon, t, b, planned }) => (
          <div key={t} className="rounded-2xl border bg-surface p-6 shadow-card">
            <Icon className="mb-4 size-6 text-neon" aria-hidden />
            <h3 className="flex items-center gap-2 font-semibold">{t} {planned && <PlannedBadge />}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border bg-gradient-primary p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">Run a business in Tanzania?</h2>
            <p className="mt-2 text-primary-foreground/85">Get ready to list your products and services on SokoTZ.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary" size="lg"><Link to="/dashboard">List your business</Link></Button>
            <Button asChild variant="ghost" size="lg" className="text-primary-foreground"><Link to="/assistant"><Sparkles aria-hidden /> Assistant</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
