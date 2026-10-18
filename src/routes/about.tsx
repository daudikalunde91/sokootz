import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/states";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About SokoTZ", "SokoTZ is a Tanzania-first business discovery marketplace."),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader eyebrow="About" title="Built for Tanzania, ready for more" body="SokoTZ helps people discover local businesses, products and services, and contact them directly. We are launching in Tanzania first and designing for future expansion." />
      <div className="space-y-4 text-muted-foreground">
        <p>Businesses get a simple way to be found. Customers get one place to search, compare and reach sellers.</p>
        <p>The website and the upcoming mobile app will share the same accounts and listings.</p>
      </div>
    </div>
  ),
});
