import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/site/states";
import { seo } from "@/lib/seo";

/** Admin boundary. Real role checks must come from the backend; no admin tools are exposed. */
export const Route = createFileRoute("/admin")({
  head: () => seo("Restricted", "This area is restricted.", { noindex: true }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState icon={<ShieldAlert className="size-6" aria-hidden />} title="Restricted area" body="Administration is only available to authorised SokoTZ staff." />
    </div>
  ),
});
