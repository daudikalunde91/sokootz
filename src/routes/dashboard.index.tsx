import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Clock } from "lucide-react";
import { DataState, PageHeader, Skeleton } from "@/components/site/states";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useOwnerData } from "@/lib/marketplace/owner";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { profile } = useAuth();
  const { business, listings } = useOwnerData();
  const counts = { PUBLISHED: 0, DRAFT: 0, PENDING_REVIEW: 0 } as Record<string, number>;
  for (const l of listings.data ?? []) counts[l.status] = (counts[l.status] ?? 0) + 1;

  return (
    <section>
      <PageHeader
        title={`Karibu${profile?.displayName ? `, ${profile.displayName}` : ""}`}
        body="A summary of your business on SokoTZ."
      />
      {business.isPending ? (
        <Skeleton className="h-40" />
      ) : business.isError ? (
        <DataState error={business.error} onRetry={() => business.refetch()} />
      ) : !business.data ? (
        <div className="rounded-2xl border bg-surface p-6">
          <h2 className="font-semibold">Start selling on SokoTZ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your business profile, then add products and services.
          </p>
          <Button asChild variant="hero" className="mt-4">
            <Link to="/dashboard/onboarding">Create business profile</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-surface p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Business</p>
            <Link
              to="/business/$id"
              params={{ id: business.data.id }}
              className="mt-1 block text-lg font-semibold hover:text-neon"
            >
              {business.data.name}
            </Link>
            <p className="mt-2 flex items-center gap-2 text-sm">
              {business.data.isVerified ? (
                <>
                  <BadgeCheck className="size-4 text-neon" aria-hidden /> Verified
                </>
              ) : (
                <>
                  <Clock className="size-4 text-violet" aria-hidden /> Not verified
                </>
              )}
            </p>
          </div>
          {listings.isPending ? (
            <Skeleton className="h-28 sm:col-span-2" />
          ) : listings.isError ? (
            <div className="sm:col-span-2">
              <DataState error={listings.error} />
            </div>
          ) : (
            <>
              <Stat label="Published" value={counts["PUBLISHED"] ?? 0} />
              <Stat
                label="Hidden / draft"
                value={(counts["DRAFT"] ?? 0) + (counts["PENDING_REVIEW"] ?? 0)}
              />
            </>
          )}
          <div className="sm:col-span-2 lg:col-span-4">
            <Button asChild variant="hero">
              <Link to="/dashboard/listings">Manage listings</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-surface p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
