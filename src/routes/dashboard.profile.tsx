import { createFileRoute } from "@tanstack/react-router";
import { PlannedSection } from "@/components/site/PlannedSection";

export const Route = createFileRoute("/dashboard/profile")({
  component: () => (
    <PlannedSection title="Business profile" body="Edit how your business appears to customers." items={["Name and description", "Category and location", "Phone, WhatsApp and email", "Logo and photos"]} />
  ),
});
