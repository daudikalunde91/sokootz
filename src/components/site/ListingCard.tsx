import { Link } from "@tanstack/react-router";
import { ImageOff, MapPin } from "lucide-react";
import { formatTzs, localized, type Lang } from "@/lib/api/mappers";
import type { ListingView } from "@/lib/api/types";

export function priceLabel(priceTzs: number) {
  return priceTzs > 0 ? formatTzs(priceTzs) : "Contact for price";
}

export function TypeBadge({ type }: { type: ListingView["type"] }) {
  return (
    <span className="rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-neon">
      {type === "SERVICE" ? "Huduma · Service" : "Bidhaa · Product"}
    </span>
  );
}

export function ListingImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return src ? (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-full bg-muted object-cover ${className}`}
    />
  ) : (
    <div
      className={`flex w-full items-center justify-center bg-muted text-muted-foreground ${className}`}
      aria-label="No image"
    >
      <ImageOff className="size-6" aria-hidden />
    </div>
  );
}

export function ListingCard({ l, lang }: { l: ListingView; lang: Lang }) {
  const title = localized(l.titleSw, l.titleEn, lang);
  return (
    <Link
      to="/listing/$id"
      params={{ id: l.id }}
      className="group block h-full overflow-hidden rounded-2xl border bg-surface transition-colors hover:border-neon"
    >
      <ListingImage src={l.imageSrc} alt={title} className="aspect-[4/3]" />
      <div className="space-y-2 p-4">
        <TypeBadge type={l.type} />
        <h3 className="line-clamp-2 font-semibold [overflow-wrap:anywhere]">{title}</h3>
        <p className="font-display text-lg font-bold text-gradient-neon">
          {priceLabel(l.priceTzs)}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <span className="truncate">{l.businessName}</span>
          {l.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {l.city}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
