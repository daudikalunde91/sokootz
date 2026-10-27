import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { BusinessForm } from "@/components/site/BusinessForm";
import { DataForm } from "@/components/site/DataForm";
import { DataState, PageHeader, Skeleton } from "@/components/site/states";
import { Button } from "@/components/ui/button";
import { ownerService, profileService } from "@/lib/api/services";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useOwnerData } from "@/lib/marketplace/owner";
import { userProfileSchema } from "@/lib/validation/marketplace";

export const Route = createFileRoute("/dashboard/profile")({
  component: Profile,
});

function Profile() {
  const auth = useAuth();
  const { business, refresh } = useOwnerData();
  const p = auth.profile;

  return (
    <div className="space-y-10">
      <section>
        <PageHeader
          title="Business profile"
          body="Edit how your business appears to customers on the website and the Android app."
        />
        {business.isPending ? (
          <Skeleton className="h-96" />
        ) : business.isError ? (
          <DataState error={business.error} onRetry={() => business.refetch()} />
        ) : !business.data ? (
          <div className="rounded-2xl border border-dashed bg-surface/60 p-6">
            <p className="text-sm text-muted-foreground">You don't have a business profile yet.</p>
            <Button asChild variant="hero" className="mt-4">
              <Link to="/dashboard/onboarding">Create business</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border bg-surface p-5 md:p-6">
            <p className="mb-5 flex items-center gap-2 text-sm">
              {business.data.isVerified ? (
                <>
                  <BadgeCheck className="size-4 text-neon" aria-hidden /> Verified by SokoTZ
                </>
              ) : (
                <>
                  <Clock className="size-4 text-violet" aria-hidden /> Not verified — verification
                  is done by SokoTZ staff.
                </>
              )}
            </p>
            <BusinessForm
              key={business.data.id + (business.data.updatedAt?.getTime() ?? 0)}
              business={business.data}
              submitLabel="Save changes"
              onSubmit={async (d) => {
                await ownerService.updateBusiness(business.data!.id, d);
                await refresh();
                toast.success("Mabadiliko yamehifadhiwa (Changes saved).");
              }}
            />
          </div>
        )}
      </section>

      <section>
        <PageHeader
          title="Your account"
          body={`Signed in as ${auth.user?.email ?? ""}. Account type: ${p?.role === "BUSINESS_OWNER" ? "Business owner" : p?.role === "ADMIN" ? "Administrator" : "Customer"}.`}
        />
        {p && (
          <div className="rounded-2xl border bg-surface p-5 md:p-6">
            <DataForm
              key={p.displayName + p.phoneNumber + p.aiPreferredName}
              schema={userProfileSchema}
              submitLabel="Save account"
              fields={[
                {
                  name: "displayName",
                  label: "Full name",
                  defaultValue: p.displayName,
                  maxLength: 100,
                },
                {
                  name: "phoneNumber",
                  label: "Phone number",
                  type: "tel",
                  defaultValue: p.phoneNumber,
                },
                {
                  name: "aiPreferredName",
                  label: "Name the Assistant should use",
                  defaultValue: p.aiPreferredName,
                  maxLength: 100,
                },
              ]}
              onSubmit={async (d) => {
                await profileService.update(d);
                await auth.refreshProfile();
                toast.success("Akaunti imehifadhiwa (Account saved).");
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
