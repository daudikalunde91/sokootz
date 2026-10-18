import { createFileRoute } from "@tanstack/react-router";
import { PlannedSection } from "@/components/site/PlannedSection";

export const Route = createFileRoute("/dashboard/")({
  component: () => (
    <PlannedSection title="Overview" body="A summary of your business on SokoTZ." items={["Profile completeness", "Published listings", "Verification status", "Analytics (when supported)"]} />
  ),
});
