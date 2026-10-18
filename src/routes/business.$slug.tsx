import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState, Skeleton } from "@/components/site/states";
import { businessesService } from "@/lib/api/services";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/business/$slug")({
  head: () => seo("Business profile", "View a business on SokoTZ and contact them directly."),
  component: BusinessPage,
});

function BusinessPage() {
  const { slug } = Route.useParams();
  const q = useQuery({ queryKey: ["business", slug], queryFn: () => businessesService.get(slug), retry: false });
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      {q.isPending ? <Skeleton className="h-64" /> : q.isError ? <DataState error={q.error} /> : (
        <article className="rounded-2xl border bg-surface p-6 md:p-10">
          <h1 className="text-3xl font-bold">{q.data.name}</h1>
          {q.data.category && <p className="mt-1 text-neon">{q.data.category.name}</p>}
          <p className="mt-4 text-muted-foreground">{q.data.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {q.data.phone && <Button asChild variant="hero"><a href={`tel:${q.data.phone}`}><Phone aria-hidden /> Call</a></Button>}
            {q.data.whatsapp && <Button asChild variant="outline"><a href={`https://wa.me/${q.data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /> WhatsApp</a></Button>}
          </div>
        </article>
      )}
    </div>
  );
}
