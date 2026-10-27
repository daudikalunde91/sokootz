import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { DataForm } from "@/components/site/DataForm";
import { ListingImage, priceLabel, TypeBadge } from "@/components/site/ListingCard";
import { DataState, EmptyState, PageHeader, Skeleton } from "@/components/site/states";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { ownerService } from "@/lib/api/services";
import type { BusinessView, ListingView } from "@/lib/api/types";
import { CATEGORIES, REGIONS } from "@/lib/marketplace/catalog";
import { imageFileToDataUri } from "@/lib/marketplace/images";
import { useOwnerData } from "@/lib/marketplace/owner";
import { listingSchema } from "@/lib/validation/marketplace";

export const Route = createFileRoute("/dashboard/listings")({
  component: Listings,
});

function Listings() {
  const { business, listings, refresh } = useOwnerData();
  const [editing, setEditing] = useState<ListingView | "new" | null>(null);

  if (business.isPending) return <Skeleton className="h-96" />;
  if (business.isError)
    return <DataState error={business.error} onRetry={() => business.refetch()} />;
  if (!business.data) {
    return (
      <section>
        <PageHeader title="Products & services" />
        <EmptyState
          title="Create your business first"
          body="Listings belong to a business profile."
          action={
            <Button asChild variant="hero">
              <Link to="/dashboard/onboarding">Create business</Link>
            </Button>
          }
        />
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title="Products & services"
        body="Published listings appear on the website and the Android app. Hidden listings are only visible to you."
      >
        {!editing && (
          <Button variant="hero" className="mt-4" onClick={() => setEditing("new")}>
            <Plus aria-hidden /> Add listing
          </Button>
        )}
      </PageHeader>

      {editing && (
        <div className="mb-8 rounded-2xl border bg-surface p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {editing === "new" ? "New listing" : "Edit listing"}
            </h2>
            <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setEditing(null)}>
              <X />
            </Button>
          </div>
          <ListingForm
            key={editing === "new" ? "new" : editing.id}
            business={business.data}
            listing={editing === "new" ? null : editing}
            onDone={async (msg) => {
              await refresh();
              setEditing(null);
              toast.success(msg);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {listings.isPending ? (
        <Skeleton className="h-40" />
      ) : listings.isError ? (
        <DataState error={listings.error} onRetry={() => listings.refetch()} />
      ) : listings.data.length === 0 ? (
        !editing && <EmptyState title="No listings yet" body="Add your first product or service." />
      ) : (
        <ul className="space-y-3">
          {listings.data.map((l) => (
            <OwnerRow key={l.id} l={l} onEdit={() => setEditing(l)} onChanged={refresh} />
          ))}
        </ul>
      )}
    </section>
  );
}

function OwnerRow({
  l,
  onEdit,
  onChanged,
}: {
  l: ListingView;
  onEdit: () => void;
  onChanged: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const published = l.status === "PUBLISHED";

  async function act(fn: () => Promise<unknown>, ok: string) {
    setBusy(true);
    try {
      await fn();
      await onChanged();
      toast.success(ok);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-2xl border bg-surface p-3 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center">
      <ListingImage src={l.imageSrc} alt={l.titleSw} className="aspect-square rounded-lg" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={l.type} />
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${published ? "bg-neon/10 text-neon" : "bg-violet/10 text-violet"}`}
          >
            {published ? "Published" : l.status === "PENDING_REVIEW" ? "Pending review" : "Hidden"}
          </span>
        </div>
        <Link
          to="/listing/$id"
          params={{ id: l.id }}
          className="mt-1 block truncate font-semibold hover:text-neon"
        >
          {l.titleSw}
        </Link>
        <p className="text-sm text-muted-foreground">
          {priceLabel(l.priceTzs)} · {l.viewsCount} views
        </p>
      </div>
      <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1">
        <Button variant="outline" size="sm" disabled={busy} onClick={onEdit}>
          <Pencil aria-hidden /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() =>
            act(
              () => ownerService.setListingStatus(l.id, published ? "DRAFT" : "PUBLISHED"),
              published ? "Listing hidden." : "Listing published.",
            )
          }
        >
          {published ? (
            <>
              <EyeOff aria-hidden /> Hide
            </>
          ) : (
            <>
              <Eye aria-hidden /> Publish
            </>
          )}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={busy} aria-label={`Delete ${l.titleSw}`}>
              <Trash2 aria-hidden /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
              <AlertDialogDescription>
                “{l.titleSw}” will be removed from the website and the Android app. This cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => act(() => ownerService.deleteListing(l.id), "Listing deleted.")}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}

function ListingForm({
  business,
  listing,
  onDone,
  onCancel,
}: {
  business: BusinessView;
  listing: ListingView | null;
  onDone: (msg: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [image, setImage] = useState<string>(listing?.imageSrc ?? "");
  const [imgBusy, setImgBusy] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setImgError(null);
    setImgBusy(true);
    try {
      setImage(await imageFileToDataUri(file));
    } catch (e) {
      setImgError(e instanceof Error ? e.message : "Could not use this image.");
    } finally {
      setImgBusy(false);
    }
  }

  const city = listing?.city || business.city || "Dar es Salaam";
  return (
    <DataForm
      schema={listingSchema}
      submitLabel={listing ? "Save listing" : "Create listing"}
      transform={(raw) => ({ ...raw, imageUrl: image })}
      fields={[
        {
          name: "type",
          label: "Type",
          type: "radio",
          defaultValue: listing?.type ?? "PRODUCT",
          options: [
            { value: "PRODUCT", label: "Bidhaa · Product" },
            { value: "SERVICE", label: "Huduma · Service" },
          ],
        },
        {
          name: "titleSw",
          label: "Jina (Kiswahili)",
          defaultValue: listing?.titleSw,
          maxLength: 200,
        },
        {
          name: "titleEn",
          label: "Title (English, optional)",
          defaultValue: listing && listing.titleEn !== listing.titleSw ? listing.titleEn : "",
          maxLength: 200,
        },
        {
          name: "priceTzs",
          label: "Price (TZS)",
          type: "number",
          defaultValue: listing ? String(listing.priceTzs) : "",
          hint: "Use 0 for “contact for price”.",
        },
        {
          name: "categorySlug",
          label: "Category",
          type: "select",
          defaultValue: listing?.categorySlug || business.categorySlug,
          options: CATEGORIES.map((c) => ({ value: c.slug, label: `${c.nameSw} · ${c.nameEn}` })),
        },
        {
          name: "city",
          label: "City / region",
          type: "select",
          defaultValue: city,
          options: Array.from(new Set([...(REGIONS.includes(city) ? [] : [city]), ...REGIONS])).map(
            (r) => ({ value: r, label: r }),
          ),
        },
        {
          name: "phoneNumber",
          label: "Phone (optional)",
          type: "tel",
          defaultValue: listing?.phoneNumber ?? business.phoneNumber,
          hint: "Defaults to your business phone.",
        },
        {
          name: "whatsappNumber",
          label: "WhatsApp (optional)",
          type: "tel",
          defaultValue: listing?.whatsappNumber ?? business.whatsappNumber,
        },
        {
          name: "descriptionSw",
          label: "Maelezo (Kiswahili)",
          type: "textarea",
          defaultValue: listing?.descriptionSw,
          maxLength: 2000,
        },
        {
          name: "descriptionEn",
          label: "Description (English, optional)",
          type: "textarea",
          defaultValue:
            listing && listing.descriptionEn !== listing.descriptionSw ? listing.descriptionEn : "",
          maxLength: 2000,
        },
        {
          name: "status",
          label: "Visibility",
          type: "radio",
          defaultValue: listing?.status === "PUBLISHED" || !listing ? "PUBLISHED" : "DRAFT",
          options: [
            { value: "PUBLISHED", label: "Publish now" },
            { value: "DRAFT", label: "Hidden (draft)" },
          ],
        },
      ]}
      extra={
        <div>
          <p className="mb-1.5 text-sm font-medium">Photo (optional)</p>
          <div className="flex flex-wrap items-center gap-4">
            <ListingImage
              src={image || null}
              alt="Listing photo preview"
              className="aspect-square max-w-28 rounded-lg"
            />
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <label className="cursor-pointer">
                  {imgBusy ? (
                    <Loader2 className="animate-spin" aria-hidden />
                  ) : (
                    <ImagePlus aria-hidden />
                  )}{" "}
                  {image ? "Change photo" : "Add photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => pick(e.target.files?.[0])}
                  />
                </label>
              </Button>
              {image && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setImage("")}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG or WebP. Resized to 600px and stored with the listing, like the Android app.
          </p>
          {imgError && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {imgError}
            </p>
          )}
        </div>
      }
      secondary={
        <Button type="button" variant="ghost" className="h-11" onClick={onCancel}>
          Cancel
        </Button>
      }
      onSubmit={async (d) => {
        if (imgBusy) throw new Error("Wait for the photo to finish processing.");
        if (listing) {
          await ownerService.updateListing(listing.id, d);
          await onDone("Tangazo limehifadhiwa (Listing saved).");
        } else {
          await ownerService.createListing(d);
          await onDone(
            d.status === "PUBLISHED"
              ? "Tangazo limechapishwa (Listing published)."
              : "Listing saved as hidden.",
          );
        }
      }}
    />
  );
}
