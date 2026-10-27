import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { BusinessForm } from "@/components/site/BusinessForm";
import { DataState, PageHeader, Skeleton } from "@/components/site/states";
import { Button } from "@/components/ui/button";
import { ownerService } from "@/lib/api/services";
import { useOwnerData } from "@/lib/marketplace/owner";

export const Route = createFileRoute("/dashboard/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { business, refresh } = useOwnerData();
  const navigate = useNavigate();

  if (business.isPending) return <Skeleton className="h-96" />;
  if (business.isError)
    return <DataState error={business.error} onRetry={() => business.refetch()} />;
  if (business.data) {
    return (
      <section>
        <PageHeader
          title="You're set up"
          body={`Your business “${business.data.name}” already exists. One business profile per account, the same as the Android app.`}
        />
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero">
            <Link to="/dashboard/listings">Manage listings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard/profile">Edit profile</Link>
          </Button>
        </div>
      </section>
    );
  }
  return (
    <section>
      <PageHeader
        title="Create your business profile"
        body="Customers see these details on your business page and listings. New businesses start unverified; only SokoTZ staff can verify a business."
      />
      <div className="rounded-2xl border bg-surface p-5 md:p-6">
        <BusinessForm
          submitLabel="Create business"
          onSubmit={async (d) => {
            await ownerService.createBusiness(d);
            await refresh();
            toast.success("Biashara imeundwa (Business created).");
            navigate({ to: "/dashboard/listings" });
          }}
        />
      </div>
    </section>
  );
}
