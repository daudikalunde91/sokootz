/**
 * Shared marketplace entity shapes (PROPOSED).
 * Derived from docs/DATABASE_DESIGN.md candidate entities. The real field set
 * is defined by the future backend; the mobile app must use the same shapes.
 * IDs are opaque strings so web and mobile never assume numeric IDs.
 */
export type Id = string;

export interface Category {
  id: Id;
  slug: string;
  name: string;
}

export interface Location {
  id: Id;
  countryCode: string; // ISO 3166-1 alpha-2, e.g. "TZ"
  region?: string;
  district?: string;
}

export interface BusinessProfile {
  id: Id;
  slug: string;
  name: string;
  description: string;
  category: Category | null;
  location: Location | null;
  phone?: string;
  whatsapp?: string;
  email?: string;
  verified: boolean;
}

export type ListingType = "product" | "service";

export interface ListingImage {
  id: Id;
  url: string;
  alt?: string;
}

export interface Listing {
  id: Id;
  title: string;
  description: string;
  type: ListingType;
  business: Pick<BusinessProfile, "id" | "slug" | "name">;
  images: ListingImage[];
  status: "draft" | "published" | "hidden";
  createdAt: string; // ISO 8601
}

/** Proposed pagination envelope shared by every list endpoint. */
export interface Page<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface SearchParams {
  q?: string | undefined;
  category?: string | undefined;
  region?: string | undefined;
  type?: ListingType | undefined;
  page?: number | undefined;
}
