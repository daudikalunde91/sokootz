import { z } from "zod";
import { CATEGORIES } from "@/lib/marketplace/catalog";
import { phoneSchema } from "./auth";

const slugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];
const optionalPhone = z.union([z.literal(""), phoneSchema]);

/** Limits match isValidBusiness() in the Android firestore.rules. */
export const businessSchema = z.object({
  name: z.string().trim().min(2, "Enter the business name.").max(150),
  categorySlug: z.enum(slugs, { message: "Choose a category." }),
  city: z.string().trim().min(2, "Enter the city or region.").max(100),
  district: z.string().trim().max(100).default(""),
  phoneNumber: phoneSchema,
  whatsappNumber: optionalPhone.default(""),
  descriptionSw: z
    .string()
    .trim()
    .min(10, "Describe your business (at least 10 characters).")
    .max(2000),
  descriptionEn: z.string().trim().max(2000).default(""),
  openingHours: z.string().trim().max(200).default(""),
});

/** Limits match isValidListing() in the Android firestore.rules. */
export const listingSchema = z.object({
  titleSw: z.string().trim().min(2, "Enter a title.").max(200),
  titleEn: z.string().trim().max(200).default(""),
  descriptionSw: z.string().trim().min(10, "Describe it (at least 10 characters).").max(2000),
  descriptionEn: z.string().trim().max(2000).default(""),
  priceTzs: z.coerce
    .number({ message: "Enter a price in TZS." })
    .int("Use whole shillings, no decimals.")
    .min(0, "Price cannot be negative.")
    .max(10_000_000_000, "Price is too large."),
  categorySlug: z.enum(slugs, { message: "Choose a category." }),
  type: z.enum(["PRODUCT", "SERVICE"]),
  city: z.string().trim().min(2, "Enter the city or region.").max(100),
  phoneNumber: optionalPhone.default(""),
  whatsappNumber: optionalPhone.default(""),
  imageUrl: z.string().max(250_000, "Image is too large.").default(""),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

export const userProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Enter your name.").max(100),
  phoneNumber: z.union([z.literal(""), phoneSchema]),
  aiPreferredName: z.string().trim().max(100).default(""),
});
