import { DataForm } from "./DataForm";
import type { Field } from "./FormField";
import { CATEGORIES, DEFAULT_OPENING_HOURS, REGIONS } from "@/lib/marketplace/catalog";
import { businessSchema } from "@/lib/validation/marketplace";
import type { BusinessInput, BusinessView } from "@/lib/api/types";

export function businessFields(b?: BusinessView | null): Field[] {
  return [
    { name: "name", label: "Business name", defaultValue: b?.name, maxLength: 150 },
    {
      name: "categorySlug",
      label: "Category",
      type: "select",
      defaultValue: b?.categorySlug,
      options: CATEGORIES.map((c) => ({ value: c.slug, label: `${c.nameSw} · ${c.nameEn}` })),
    },
    {
      name: "city",
      label: "City / region",
      type: "select",
      defaultValue: b?.city || "Dar es Salaam",
      options: Array.from(
        new Set([...(b?.city && !REGIONS.includes(b.city) ? [b.city] : []), ...REGIONS]),
      ).map((r) => ({ value: r, label: r })),
    },
    {
      name: "district",
      label: "District / area",
      defaultValue: b?.district,
      placeholder: "e.g. Kariakoo",
      maxLength: 100,
    },
    {
      name: "phoneNumber",
      label: "Phone number",
      type: "tel",
      defaultValue: b?.phoneNumber,
      placeholder: "0712 345 678",
    },
    {
      name: "whatsappNumber",
      label: "WhatsApp number (optional)",
      type: "tel",
      defaultValue: b?.whatsappNumber,
      placeholder: "0712 345 678",
    },
    {
      name: "openingHours",
      label: "Opening hours",
      defaultValue: b?.openingHours || DEFAULT_OPENING_HOURS,
      maxLength: 200,
    },
    {
      name: "descriptionSw",
      label: "Maelezo (Kiswahili)",
      type: "textarea",
      defaultValue: b?.descriptionSw,
      maxLength: 2000,
    },
    {
      name: "descriptionEn",
      label: "Description (English, optional)",
      type: "textarea",
      defaultValue: b?.descriptionEn && b.descriptionEn !== b.descriptionSw ? b.descriptionEn : "",
      maxLength: 2000,
      hint: "Leave empty to show the Kiswahili text to English readers.",
    },
  ];
}

export function BusinessForm({
  business,
  submitLabel,
  onSubmit,
}: {
  business?: BusinessView | null;
  submitLabel: string;
  onSubmit: (d: BusinessInput) => Promise<unknown>;
}) {
  return (
    <DataForm
      fields={businessFields(business)}
      schema={businessSchema}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
    />
  );
}
