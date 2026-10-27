/**
 * Adapters between Android Firestore documents and website view models, and
 * builders for the exact payloads the website writes. Pure functions only —
 * no Firebase SDK import — so every rule here is unit tested.
 */
import { categoryNameSw, DEFAULT_OPENING_HOURS } from "@/lib/marketplace/catalog";
import {
  LISTING_TYPES,
  USER_ROLES,
  type BusinessDoc,
  type BusinessInput,
  type BusinessView,
  type ListingDoc,
  type ListingInput,
  type ListingType,
  type ListingView,
  type TimestampLike,
  type UserProfileView,
  type UserRole,
} from "./types";

type Raw = Record<string, unknown>;

const s = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const n = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const b = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);

export function toDate(v: unknown): Date | null {
  if (
    v &&
    typeof v === "object" &&
    "toDate" in v &&
    typeof (v as TimestampLike).toDate === "function"
  ) {
    return (v as TimestampLike).toDate();
  }
  return null;
}

/** Accepts data URIs, raw base64 JPEG/PNG (as Android does) and https URLs; rejects anything else. */
export function safeImageSrc(v: unknown): string | null {
  const raw = s(v).trim();
  if (!raw) return null;
  if (/^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(raw)) return raw;
  if (raw.startsWith("/9j/")) return `data:image/jpeg;base64,${raw}`;
  if (raw.startsWith("iVBORw0")) return `data:image/png;base64,${raw}`;
  if (/^https:\/\//i.test(raw)) return raw;
  return null;
}

export function toUserProfileView(id: string, d: Raw): UserProfileView {
  const role = s(d["role"], "CUSTOMER");
  return {
    id,
    userId: s(d["userId"], id),
    displayName: s(d["displayName"]),
    email: s(d["email"]),
    phoneNumber: s(d["phoneNumber"]),
    role: (USER_ROLES as readonly string[]).includes(role) ? (role as UserRole) : "CUSTOMER",
    photoUrl: s(d["photoUrl"]),
    aiPreferredName: s(d["aiPreferredName"]),
    hasAcceptedTerms: b(d["hasAcceptedTerms"], true),
  };
}

export function toBusinessView(id: string, d: Raw): BusinessView {
  const categorySlug = s(d["categorySlug"]);
  return {
    id,
    ownerId: s(d["ownerId"]),
    name: s(d["name"]),
    categorySlug,
    categoryName: s(d["categoryName"]) || categoryNameSw(categorySlug),
    descriptionSw: s(d["descriptionSw"]),
    descriptionEn: s(d["descriptionEn"]),
    city: s(d["city"]),
    district: s(d["district"]),
    address: s(d["address"]),
    phoneNumber: s(d["phoneNumber"]),
    whatsappNumber: s(d["whatsappNumber"]),
    // Android may also have written "verified" (Kotlin is-prefix serialisation); only trust explicit true.
    isVerified: d["isVerified"] === true,
    rating: n(d["rating"]),
    reviewCount: n(d["reviewCount"]),
    openingHours: s(d["openingHours"]),
    createdAt: toDate(d["createdAt"]),
    updatedAt: toDate(d["updatedAt"]),
  };
}

export function toListingView(id: string, d: Raw): ListingView {
  const type = s(d["type"], "PRODUCT").toUpperCase();
  return {
    id,
    businessId: s(d["businessId"]),
    ownerId: s(d["ownerId"]),
    businessName: s(d["businessName"]),
    titleSw: s(d["titleSw"]),
    titleEn: s(d["titleEn"]),
    descriptionSw: s(d["descriptionSw"]),
    descriptionEn: s(d["descriptionEn"]),
    priceTzs: Math.max(0, Math.trunc(n(d["priceTzs"]))),
    categorySlug: s(d["categorySlug"]),
    type: (LISTING_TYPES as readonly string[]).includes(type) ? (type as ListingType) : "PRODUCT",
    // Android's model default is PUBLISHED when the field is absent.
    status: s(d["status"]) || "PUBLISHED",
    city: s(d["city"]),
    isFeatured: d["isFeatured"] === true,
    imageSrc: safeImageSrc(d["imageUrl"]),
    viewsCount: n(d["viewsCount"]),
    phoneNumber: s(d["phoneNumber"]),
    whatsappNumber: s(d["whatsappNumber"]),
    createdAt: toDate(d["createdAt"]),
    updatedAt: toDate(d["updatedAt"]),
  };
}

/** Public visibility rule: only PUBLISHED listings are shown to visitors and the Assistant. */
export function isPubliclyVisible(l: Pick<ListingView, "status">): boolean {
  return l.status === "PUBLISHED";
}

export type Lang = "sw" | "en";
/** Mirrors Android localizedTitle/localizedDesc: Kiswahili is canonical, English falls back to it. */
export function localized(sw: string, en: string, lang: Lang): string {
  return lang === "sw" ? sw || en : en.trim() || sw;
}

export function formatTzs(amount: number): string {
  return `TZS ${Math.trunc(amount).toLocaleString("en-US")}`;
}

/**
 * Normalises a Tanzanian phone number to international digits (255XXXXXXXXX)
 * for WhatsApp / tel links. Returns null when the number is not usable.
 */
export function normalizeTzPhone(raw: string | undefined | null): string | null {
  const digits = s(raw).replace(/\D/g, "");
  if (!digits) return null;
  let intl = digits;
  if (intl.startsWith("00")) intl = intl.slice(2);
  if (intl.length === 10 && intl.startsWith("0")) intl = "255" + intl.slice(1);
  else if (intl.length === 9 && /^[67]/.test(intl)) intl = "255" + intl;
  if (intl.startsWith("255")) return intl.length === 12 ? intl : null;
  // Other international numbers: accept E.164 length range.
  return intl.length >= 8 && intl.length <= 15 ? intl : null;
}

export function whatsappHref(raw: string | undefined | null): string | null {
  const p = normalizeTzPhone(raw);
  return p ? `https://wa.me/${p}` : null;
}

export function telHref(raw: string | undefined | null): string | null {
  const p = normalizeTzPhone(raw);
  return p ? `tel:+${p}` : null;
}

/* ------------------------------------------------------------------ writes */

/**
 * Builders take the authenticated UID from Firebase Auth (never from a form)
 * and a server-timestamp sentinel. Privileged fields are fixed here:
 * role can never be ADMIN, isVerified is false, rating/reviewCount are 0,
 * isFeatured is false and viewsCount is 0 — matching firestore.rules.
 */
export function buildUserProfileCreate<TS>(
  uid: string,
  input: {
    displayName: string;
    email: string;
    phoneNumber: string;
    role: string;
    photoUrl: string;
    aiPreferredName: string;
    hasAcceptedTerms: boolean;
  },
  ts: TS,
) {
  const role: UserRole = input.role === "BUSINESS_OWNER" ? "BUSINESS_OWNER" : "CUSTOMER";
  return {
    userId: uid,
    displayName: input.displayName.trim().slice(0, 100) || "Mwanachama SokoTZ",
    email: input.email.trim().slice(0, 150),
    phoneNumber: input.phoneNumber.trim().slice(0, 50),
    role,
    photoUrl: input.photoUrl.length <= 250_000 ? input.photoUrl : "",
    aiPreferredName: input.aiPreferredName.trim().slice(0, 100),
    hasAcceptedTerms: input.hasAcceptedTerms,
    createdAt: ts,
    updatedAt: ts,
  };
}

/** Only these profile fields are user-editable; role and userId are immutable in firestore.rules. */
export function buildUserProfileUpdate<TS>(
  input: { displayName: string; phoneNumber: string; aiPreferredName: string },
  ts: TS,
) {
  return {
    displayName: input.displayName.trim().slice(0, 100),
    phoneNumber: input.phoneNumber.trim().slice(0, 50),
    aiPreferredName: input.aiPreferredName.trim().slice(0, 100),
    updatedAt: ts,
  };
}

function businessFields(input: BusinessInput) {
  const district = input.district.trim();
  const city = input.city.trim();
  return {
    name: input.name.trim(),
    categorySlug: input.categorySlug,
    categoryName: categoryNameSw(input.categorySlug),
    descriptionSw: input.descriptionSw.trim(),
    // Android writes the same text to both; the website keeps English optional and falls back to Kiswahili.
    descriptionEn: input.descriptionEn.trim() || input.descriptionSw.trim(),
    city,
    district,
    phoneNumber: input.phoneNumber.trim(),
    whatsappNumber: input.whatsappNumber.trim(),
    openingHours: input.openingHours.trim() || DEFAULT_OPENING_HOURS,
    address: [district, city].filter(Boolean).join(", "),
  };
}

export function buildBusinessCreate<TS>(uid: string, input: BusinessInput, ts: TS) {
  return {
    ownerId: uid,
    ...businessFields(input),
    isVerified: false,
    // Android writes rating 5.0, which firestore.rules rejects and which would be a fabricated rating.
    rating: 0,
    reviewCount: 0,
    createdAt: ts,
    updatedAt: ts,
  };
}

/** Partial update — ownerId, isVerified, rating and reviewCount are never sent. */
export function buildBusinessUpdate<TS>(input: BusinessInput, ts: TS) {
  return { ...businessFields(input), updatedAt: ts };
}

function listingFields(input: ListingInput) {
  return {
    titleSw: input.titleSw.trim(),
    titleEn: input.titleEn.trim() || input.titleSw.trim(),
    descriptionSw: input.descriptionSw.trim(),
    descriptionEn: input.descriptionEn.trim() || input.descriptionSw.trim(),
    priceTzs: Math.max(0, Math.trunc(input.priceTzs)),
    categorySlug: input.categorySlug,
    type: input.type,
    city: input.city.trim(),
    phoneNumber: input.phoneNumber.trim(),
    whatsappNumber: input.whatsappNumber.trim(),
    imageUrl: input.imageUrl,
    status: input.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
  };
}

/** businessId / businessName come from the owner's own business document, never from the form. */
export function buildListingCreate<TS>(
  uid: string,
  business: { id: string; name: string },
  input: ListingInput,
  ts: TS,
) {
  return {
    businessId: business.id,
    ownerId: uid,
    businessName: business.name,
    ...listingFields(input),
    isFeatured: false,
    viewsCount: 0,
    createdAt: ts,
    updatedAt: ts,
  };
}

/** Partial update — ownerId, businessId, isFeatured and viewsCount are never sent. */
export function buildListingUpdate<TS>(input: ListingInput, ts: TS) {
  return { ...listingFields(input), updatedAt: ts };
}

export type { BusinessDoc, ListingDoc };
