/**
 * Shared marketplace shapes.
 *
 * `*Doc` interfaces mirror the Android Firestore documents EXACTLY
 * (data/model/MarketplaceModels.kt + FirestoreMarketplaceRepository.kt writes).
 * Field names, enum values and capitalisation must not change without an
 * approved migration because the Android app reads the same documents.
 *
 * `*View` interfaces are what website pages render; adapters in ./mappers.ts
 * convert between the two. Pages never write view models to Firestore.
 */
export type Id = string;

export const USER_ROLES = ["CUSTOMER", "BUSINESS_OWNER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const LISTING_TYPES = ["PRODUCT", "SERVICE"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];
export const LISTING_STATUSES = ["PUBLISHED", "PENDING_REVIEW", "DRAFT"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

/** Firestore Timestamp duck type (avoids importing the SDK into pure code). */
export interface TimestampLike {
  toDate(): Date;
}

/** users/{uid} */
export interface UserProfileDoc {
  userId: string;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  photoUrl?: string | null;
  aiPreferredName?: string;
  hasAcceptedTerms?: boolean;
  createdAt?: TimestampLike | null;
  updatedAt?: TimestampLike | null;
}

/** businesses/{autoId} */
export interface BusinessDoc {
  ownerId: string;
  name: string;
  categorySlug: string;
  categoryName?: string;
  descriptionSw?: string;
  descriptionEn?: string;
  city: string;
  district?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  isVerified?: boolean;
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  address?: string;
  createdAt?: TimestampLike | null;
  updatedAt?: TimestampLike | null;
}

/** listings/{autoId} */
export interface ListingDoc {
  businessId: string;
  ownerId: string;
  businessName: string;
  titleSw: string;
  titleEn?: string;
  descriptionSw?: string;
  descriptionEn?: string;
  priceTzs: number;
  categorySlug: string;
  type: ListingType;
  status?: string;
  city?: string;
  isFeatured?: boolean;
  /** Android stores a base64 JPEG data URI (≤250,000 chars) or an https URL. */
  imageUrl?: string;
  viewsCount?: number;
  phoneNumber?: string;
  whatsappNumber?: string;
  createdAt?: TimestampLike | null;
  updatedAt?: TimestampLike | null;
}

export interface UserProfileView {
  id: Id;
  userId: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  photoUrl: string;
  aiPreferredName: string;
  hasAcceptedTerms: boolean;
}

export interface BusinessView {
  id: Id;
  ownerId: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  descriptionSw: string;
  descriptionEn: string;
  city: string;
  district: string;
  address: string;
  phoneNumber: string;
  whatsappNumber: string;
  isVerified: boolean;
  /** Only meaningful when reviewCount > 0; the site never shows a rating without reviews. */
  rating: number;
  reviewCount: number;
  openingHours: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ListingView {
  id: Id;
  businessId: string;
  ownerId: string;
  businessName: string;
  titleSw: string;
  titleEn: string;
  descriptionSw: string;
  descriptionEn: string;
  priceTzs: number;
  categorySlug: string;
  type: ListingType;
  status: ListingStatus | string;
  city: string;
  isFeatured: boolean;
  imageSrc: string | null;
  viewsCount: number;
  phoneNumber: string;
  whatsappNumber: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Page<T> {
  results: T[];
  count: number;
  page: number;
  pageCount: number;
}

/** URL search params (lowercase type in URLs, mapped to PRODUCT/SERVICE). */
export interface SearchParams {
  q?: string | undefined;
  category?: string | undefined;
  region?: string | undefined;
  type?: "product" | "service" | undefined;
  page?: number | undefined;
}

/** Owner-editable business fields (no ownerId / verification / rating). */
export interface BusinessInput {
  name: string;
  categorySlug: string;
  city: string;
  district: string;
  phoneNumber: string;
  whatsappNumber: string;
  descriptionSw: string;
  descriptionEn: string;
  openingHours: string;
}

/** Owner-editable listing fields (no ownerId / businessId / featured / views). */
export interface ListingInput {
  titleSw: string;
  titleEn: string;
  descriptionSw: string;
  descriptionEn: string;
  priceTzs: number;
  categorySlug: string;
  type: ListingType;
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
  imageUrl: string;
  status: "PUBLISHED" | "DRAFT";
}
