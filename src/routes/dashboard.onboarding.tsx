import { createFileRoute } from "@tanstack/react-router";
import { PlannedSection } from "@/components/site/PlannedSection";

export const Route = createFileRoute("/dashboard/onboarding")({
  component: () => (
    <PlannedSection title="Business onboarding" body="Set up your business in a few steps." items={["1. Business name and category", "2. Location", "3. Contact details and WhatsApp", "4. Submit for verification"]} />
  ),
});
