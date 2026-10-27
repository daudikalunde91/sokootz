import { createFileRoute } from "@tanstack/react-router";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { PageHeader } from "@/components/site/states";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/categories")({
  head: () => seo("Categories", "Browse SokoTZ business, product and service categories."),
  component: Categories,
});

/** Same fixed category list as the Android app (MarketplaceData.kt). */
function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        eyebrow="Discover"
        title="Categories"
        body="Browse products and services by category."
      />
      <CategoryGrid />
    </div>
  );
}
