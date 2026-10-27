import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/marketplace/catalog";

/** Same fixed category list as the Android app (MarketplaceData.kt). */
export function CategoryGrid() {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {CATEGORIES.map((c) => (
        <li key={c.slug}>
          <Link
            to="/search"
            search={{ category: c.slug }}
            className="block h-full rounded-xl border bg-surface p-5 hover:border-neon"
          >
            <span className="block font-semibold">{c.nameSw}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{c.nameEn}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
