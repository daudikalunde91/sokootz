import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataState, Skeleton } from "@/components/site/states";
import { listingsService } from "@/lib/api/services";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/listing/$id")({
  head: () => seo("Listing", "View a product or service on SokoTZ."),
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const q = useQuery({ queryKey: ["listing", id], queryFn: () => listingsService.get(id), retry: false });
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      {q.isPending ? <Skeleton className="h-80" /> : q.isError ? <DataState error={q.error} /> : (
        <article className="grid gap-8 md:grid-cols-2">
          {q.data.images[0] ? <img src={q.data.images[0].url} alt={q.data.images[0].alt ?? q.data.title} className="aspect-square w-full rounded-2xl object-cover" /> : <div className="aspect-square rounded-2xl bg-muted" />}
          <div>
            <p className="text-sm uppercase tracking-wider text-neon">{q.data.type}</p>
            <h1 className="mt-2 text-3xl font-bold">{q.data.title}</h1>
            <Link to="/business/$slug" params={{ slug: q.data.business.slug }} className="mt-2 inline-block text-muted-foreground hover:text-foreground">by {q.data.business.name}</Link>
            <p className="mt-6 whitespace-pre-line text-muted-foreground">{q.data.description}</p>
          </div>
        </article>
      )}
    </div>
  );
}
