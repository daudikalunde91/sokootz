import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataState, PageHeader, Skeleton } from "@/components/site/states";
import { categoriesService } from "@/lib/api/services";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/categories")({
  head: () => seo("Categories", "Browse SokoTZ business, product and service categories."),
  component: Categories,
});

function Categories() {
  const q = useQuery({ queryKey: ["categories"], queryFn: categoriesService.list, retry: false });
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader eyebrow="Discover" title="Categories" body="Browse businesses and listings by category." />
      {q.isPending ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : q.isError ? (
        <DataState error={q.error} />
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {q.data.results.map((c) => (
            <li key={c.id}><Link to="/search" search={{ category: c.slug }} className="block rounded-xl border bg-surface p-5 hover:border-neon">{c.name}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
