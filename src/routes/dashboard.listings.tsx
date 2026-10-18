import { createFileRoute } from "@tanstack/react-router";
import { PlannedSection } from "@/components/site/PlannedSection";

export const Route = createFileRoute("/dashboard/listings")({
  component: () => (
    <PlannedSection title="Products & services" body="Create and manage your listings." items={["Add a product or service", "Upload images", "Draft, publish or hide", "Assistant help with descriptions"]} />
  ),
});
