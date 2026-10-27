import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Clock, MapPin } from "lucide-react";
import { ContactButtons } from "@/components/site/ContactButtons";
import { ListingCard } from "@/components/site/ListingCard";
import { DataState, EmptyState, Skeleton } from "@/components/site/states";
import { businessesService, listingsService } from "@/lib/api/services";
import { localized } from "@/lib/api/mappers";
import { categoryBySlug } from "@/lib/marketplace/catalog";
import { useContentLang } from "@/lib/marketplace/useContentLang";
import { seo } from "@/lib/seo";

/** /business/:id — the id is the Firestore businesses document ID (Android has no slugs). */
export const Route = createFileRoute("/business/$id")({
  head: () => seo("Business profile", "View a business on SokoTZ and contact them directly."),
  component: BusinessPage,
});

function BusinessPage() {
  const { id } = Route.useParams();
  const [lang] = useContentLang();
  const q = useQuery({
    queryKey: ["business", id],
    queryFn: () => businessesService.get(id),
    retry: false,
  });
  const listings = useQuery({
    queryKey: ["listings", "business", id],
    queryFn: () => listingsService.forBusiness(id),
    retry: false,
    enabled: q.isSuccess,
  });

  if (q.isPending)
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <Skeleton className="h-64" />
      </div>
    );
  if (q.isError)
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <DataState error={q.error} onRetry={() => q.refetch()} />
      </div>
    );

  const b = q.data;
  const cat = categoryBySlug(b.categorySlug);
  const desc = localized(b.descriptionSw, b.descriptionEn, lang);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <article className="rounded-2xl border bg-surface p-6 md:p-10">
        <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold [overflow-wrap:anywhere]">
          {b.name}
          {b.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-0.5 text-xs font-semibold text-neon">
              <BadgeCheck className="size-3.5" aria-hidden /> Verified
            </span>
          )}
        </h1>
        <p className="mt-1 text-neon">
          {cat ? (lang === "sw" ? cat.nameSw : cat.nameEn) : b.categoryName}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          {(b.address || b.city) && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" aria-hidden />
              {b.address || b.city}
            </span>
          )}
          {b.openingHours && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" aria-hidden />
              {b.openingHours}
            </span>
          )}
          {b.reviewCount > 0 && (
            <span>
              ★ {b.rating.toFixed(1)} ({b.reviewCount})
            </span>
          )}
        </div>
        {desc && (
          <p className="mt-4 whitespace-pre-line text-muted-foreground [overflow-wrap:anywhere]">
            {desc}
          </p>
        )}
        <div className="mt-6">
          <ContactButtons phone={b.phoneNumber} whatsapp={b.whatsappNumber} context={b.name} />
        </div>
      </article>

      <section className="mt-10" aria-labelledby="biz-listings">
        <h2 id="biz-listings" className="mb-4 text-xl font-bold">
          Products & services
        </h2>
        {listings.isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : listings.isError ? (
          <DataState error={listings.error} onRetry={() => listings.refetch()} />
        ) : listings.data.length === 0 ? (
          <EmptyState
            title="No listings yet"
            body="This business hasn't published any products or services."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.data.map((l) => (
              <li key={l.id}>
                <ListingCard l={l} lang={lang} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
