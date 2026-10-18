import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { seo } from "@/lib/seo";

/**
 * Business owner area. Auth guard goes here (beforeLoad) once the backend
 * auth contract exists; until then every page explains it is unavailable.
 */
export const Route = createFileRoute("/dashboard")({
  head: () => seo("Business dashboard", "Manage your SokoTZ business profile and listings.", { noindex: true }),
  component: DashboardLayout,
});

const tabs = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/onboarding", label: "Onboarding" },
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/listings", label: "Listings" },
] as const;

function DashboardLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-violet/40 bg-violet/10 p-4 text-sm">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
        <p>The business area opens together with accounts. This is a preview of how it will be organised; nothing here can be saved yet.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto md:flex-col">
          {tabs.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: true }} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent" activeProps={{ className: "bg-accent text-foreground" }}>{t.label}</Link>
          ))}
        </nav>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
