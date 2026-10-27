import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DataState, Skeleton } from "@/components/site/states";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { seo } from "@/lib/seo";

/**
 * Business owner area. Firebase Auth state only exists in the browser, so the
 * guard runs client-side; Firestore security rules are the real enforcement
 * for every read and write made from these pages.
 */
export const Route = createFileRoute("/dashboard")({
  head: () =>
    seo("Business dashboard", "Manage your SokoTZ business profile and listings.", {
      noindex: true,
    }),
  component: DashboardLayout,
});

const tabs = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/onboarding", label: "Onboarding" },
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/listings", label: "Listings" },
] as const;

function DashboardLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (auth.configured && !auth.loading && !auth.user && pathname.startsWith("/dashboard")) {
      navigate({ to: "/auth/login", search: { redirect: pathname }, replace: true });
    }
  }, [auth.configured, auth.loading, auth.user, navigate, pathname]);

  let body;
  if (!auth.configured) body = <DataState error={new ApiError("not_configured", "")} />;
  else if (auth.loading || !auth.user) body = <Skeleton className="h-64" />;
  else if (auth.profileError)
    body = <DataState error={auth.profileError} onRetry={() => auth.refreshProfile()} />;
  else body = <Outlet />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto md:flex-col">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{body}</div>
      </div>
    </div>
  );
}
