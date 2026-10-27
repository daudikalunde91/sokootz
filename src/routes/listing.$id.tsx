import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BadgeCheck, Eye, MapPin } from "lucide-react";
import { ContactButtons } from "@/components/site/ContactButtons";
import { ListingImage, priceLabel, TypeBadge } from "@/components/site/ListingCard";
import { DataState, Skeleton } from "@/components/site/states";
import { businessesService, listingsService } from "@/lib/api/services";
import { localized } from "@/lib/api/mappers";
import { useAuth } from "@/lib/auth/AuthProvider";
import { categoryBySlug } from "@/lib/marketplace/catalog";
import { useContentLang } from "@/lib/marketplace/useContentLang";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/listing/$id")({
  head: () => seo("Listing", "View a product or service on SokoTZ and contact the seller."),
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const auth = useAuth();
  const [lang, setLang] = useContentLang();
  // Re-fetch once the session is known so owners can preview their own drafts.
  const q = useQuery({
    queryKey: ["listing", id, auth.user?.uid ?? null],
    queryFn: () => listingsService.get(id),
    retry: false,
    enabled: !auth.loading || !auth.configured,
  });
  const biz = useQuery({
    queryKey: ["business", q.data?.businessId],
    queryFn: () => businessesService.get(q.data!.businessId),
    enabled: !!q.data?.businessId,
    retry: false,
  });

  useEffect(() => {
    if (q.data && auth.user) void listingsService.recordView(q.data);
  }, [q.data, auth.user]);

  if (q.isPending)
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <Skeleton className="h-80" />
      </div>
    );
  if (q.isError)
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <DataState error={q.error} onRetry={() => q.refetch()} />
      </div>
    );

  const l = q.data;
  const title = localized(l.titleSw, l.titleEn, lang);
  const desc = localized(l.descriptionSw, l.descriptionEn, lang);
  const hasBoth = !!l.descriptionEn && l.descriptionEn !== l.descriptionSw;
  const cat = categoryBySlug(l.categorySlug);
  const b = biz.data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      {l.status !== "PUBLISHED" && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-violet/40 bg-violet/10 p-3 text-sm"
        >
          Only you can see this listing — status: {l.status}.
        </p>
      )}
      <article className="grid gap-8 md:grid-cols-2">
        <ListingImage src={l.imageSrc} alt={title} className="aspect-square rounded-2xl" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={l.type} />
            {cat && (
              <Link
                to="/search"
                search={{ category: cat.slug }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {lang === "sw" ? cat.nameSw : cat.nameEn}
              </Link>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold [overflow-wrap:anywhere]">{title}</h1>
          <p className="mt-3 font-display text-2xl font-bold text-gradient-neon">
            {priceLabel(l.priceTzs)}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {l.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" aria-hidden />
                {l.city}
              </span>
            )}
            {l.viewsCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Eye className="size-4" aria-hidden />
                {l.viewsCount} views
              </span>
            )}
          </div>
          <Link
            to="/business/$id"
            params={{ id: l.businessId }}
            className="mt-4 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            by <span className="font-semibold text-foreground">{b?.name || l.businessName}</span>
            {b?.isVerified && (
              <BadgeCheck className="size-4 text-neon" aria-label="Verified business" />
            )}
          </Link>
          {hasBoth && (
            <div
              role="group"
              aria-label="Language"
              className="mt-6 inline-flex gap-1 rounded-lg border p-0.5 text-xs"
            >
              {(["sw", "en"] as const).map((x) => (
                <button
                  key={x}
                  type="button"
                  aria-pressed={lang === x}
                  onClick={() => setLang(x)}
                  className={`min-h-9 rounded-md px-3 ${lang === x ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                >
                  {x === "sw" ? "Kiswahili" : "English"}
                </button>
              ))}
            </div>
          )}
          {desc && (
            <p className="mt-4 whitespace-pre-line text-muted-foreground [overflow-wrap:anywhere]">
              {desc}
            </p>
          )}
          <div className="mt-8">
            <ContactButtons
              phone={l.phoneNumber || b?.phoneNumber || ""}
              whatsapp={l.whatsappNumber || b?.whatsappNumber || ""}
              context={title}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
