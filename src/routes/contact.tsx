import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader } from "@/components/site/states";
import { Mail } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Get in touch with the SokoTZ team."),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader eyebrow="Contact" title="Talk to us" />
      <EmptyState icon={<Mail className="size-6" aria-hidden />} title="Contact details coming soon" body="Official SokoTZ support channels will be published here before launch." />
    </div>
  ),
});
