/**
 * Feature services — the only place pages read or write marketplace data.
 * Backed by the Android app's Firebase project and named Firestore database
 * (see src/lib/firebase/config.ts). Collections: users, businesses, listings.
 *
 * Ownership is enforced twice: payloads are built from the authenticated UID
 * (never form input), and firestore.rules re-checks every write server-side.
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase/client";
import { ApiError, toApiError } from "./client";
import {
  buildBusinessCreate,
  buildBusinessUpdate,
  buildListingCreate,
  buildListingUpdate,
  buildUserProfileCreate,
  buildUserProfileUpdate,
  isPubliclyVisible,
  toBusinessView,
  toListingView,
  toUserProfileView,
} from "./mappers";
import { filterListings, paginate } from "@/lib/marketplace/search";
import type {
  BusinessInput,
  BusinessView,
  ListingInput,
  ListingView,
  Page,
  SearchParams,
  UserProfileView,
} from "./types";

/** Upper bound for the in-memory public catalogue (Firestore has no full-text search). */
export const PUBLIC_LISTING_LIMIT = 500;

async function run<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw toApiError(e);
  }
}

function requireUid(): string {
  const uid = getFirebase().auth.currentUser?.uid;
  if (!uid) throw new ApiError("unauthorized", "Please log in to continue.");
  return uid;
}

/* ------------------------------------------------------------------ public */

export const listingsService = {
  /** All PUBLISHED listings (bounded). Equality-only query: no composite index needed. */
  publicCatalogue: () =>
    run(async () => {
      const { db } = getFirebase();
      const snap = await getDocs(
        query(
          collection(db, "listings"),
          where("status", "==", "PUBLISHED"),
          limit(PUBLIC_LISTING_LIMIT),
        ),
      );
      return snap.docs.map((d) => toListingView(d.id, d.data()));
    }),

  search: async (p: SearchParams): Promise<Page<ListingView>> => {
    const all = await listingsService.publicCatalogue();
    return paginate(filterListings(all, p), p.page ?? 1);
  },

  /** Single listing; non-published listings are only returned to their owner. */
  get: (id: string) =>
    run(async () => {
      const { db, auth } = getFirebase();
      const snap = await getDoc(doc(db, "listings", id));
      if (!snap.exists()) throw new ApiError("not_found", "This listing was not found.");
      const l = toListingView(snap.id, snap.data());
      if (!isPubliclyVisible(l) && l.ownerId !== auth.currentUser?.uid) {
        throw new ApiError("not_found", "This listing is not available.");
      }
      return l;
    }),

  forBusiness: (businessId: string) =>
    run(async () => {
      const { db } = getFirebase();
      const snap = await getDocs(
        query(
          collection(db, "listings"),
          where("businessId", "==", businessId),
          where("status", "==", "PUBLISHED"),
          limit(200),
        ),
      );
      return filterListings(
        snap.docs.map((d) => toListingView(d.id, d.data())),
        {},
      );
    }),

  /**
   * Unique-viewer counting, same protocol as Android: signed-in users create
   * listings/{id}/viewers/{uid} once, then increment viewsCount by exactly 1.
   * Owners' own views are not counted. Failures are silent (non-critical).
   */
  recordView: async (listing: ListingView) => {
    try {
      const { db, auth } = getFirebase();
      const uid = auth.currentUser?.uid;
      if (!uid || uid === listing.ownerId) return;
      const viewer = doc(db, "listings", listing.id, "viewers", uid);
      if ((await getDoc(viewer)).exists()) return;
      await setDoc(viewer, { viewedAt: serverTimestamp() });
      await updateDoc(doc(db, "listings", listing.id), {
        viewsCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch {
      /* view counting must never break the page */
    }
  },
};

export const businessesService = {
  get: (id: string) =>
    run(async () => {
      const { db } = getFirebase();
      const snap = await getDoc(doc(db, "businesses", id));
      if (!snap.exists()) throw new ApiError("not_found", "This business was not found.");
      return toBusinessView(snap.id, snap.data());
    }),
};

/* ------------------------------------------------------------------- owner */

export const profileService = {
  get: (uid: string) =>
    run(async () => {
      const snap = await getDoc(doc(getFirebase().db, "users", uid));
      return snap.exists() ? toUserProfileView(snap.id, snap.data()) : null;
    }),

  /** Creates users/{uid} with an Android-compatible document. Role is CUSTOMER or BUSINESS_OWNER only. */
  create: (uid: string, input: Parameters<typeof buildUserProfileCreate>[1]) =>
    run(async () => {
      const payload = buildUserProfileCreate(uid, input, serverTimestamp());
      await setDoc(doc(getFirebase().db, "users", uid), payload);
      return toUserProfileView(uid, { ...payload, createdAt: null, updatedAt: null });
    }),

  update: (input: { displayName: string; phoneNumber: string; aiPreferredName: string }) =>
    run(async () => {
      const uid = requireUid();
      await updateDoc(
        doc(getFirebase().db, "users", uid),
        buildUserProfileUpdate(input, serverTimestamp()),
      );
    }),
};

export const ownerService = {
  /** Android supports one business per owner (first business with ownerId == uid). */
  myBusiness: () =>
    run(async (): Promise<BusinessView | null> => {
      const uid = requireUid();
      const snap = await getDocs(
        query(collection(getFirebase().db, "businesses"), where("ownerId", "==", uid), limit(1)),
      );
      const d = snap.docs[0];
      return d ? toBusinessView(d.id, d.data()) : null;
    }),

  createBusiness: (input: BusinessInput) =>
    run(async () => {
      const uid = requireUid();
      const existing = await ownerService.myBusiness();
      if (existing) throw new ApiError("validation", "You already have a business profile.");
      const ref = await addDoc(
        collection(getFirebase().db, "businesses"),
        buildBusinessCreate(uid, input, serverTimestamp()),
      );
      return ref.id;
    }),

  updateBusiness: (businessId: string, input: BusinessInput) =>
    run(async () => {
      requireUid();
      await updateDoc(
        doc(getFirebase().db, "businesses", businessId),
        buildBusinessUpdate(input, serverTimestamp()),
      );
    }),

  myListings: () =>
    run(async () => {
      const uid = requireUid();
      const snap = await getDocs(
        query(collection(getFirebase().db, "listings"), where("ownerId", "==", uid), limit(500)),
      );
      return snap.docs
        .map((d) => toListingView(d.id, d.data()))
        .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
    }),

  createListing: (input: ListingInput) =>
    run(async () => {
      const uid = requireUid();
      const business = await ownerService.myBusiness();
      if (!business)
        throw new ApiError("validation", "Create your business profile before adding listings.");
      const ref = await addDoc(
        collection(getFirebase().db, "listings"),
        buildListingCreate(uid, { id: business.id, name: business.name }, input, serverTimestamp()),
      );
      return ref.id;
    }),

  updateListing: (listingId: string, input: ListingInput) =>
    run(async () => {
      requireUid();
      await updateDoc(
        doc(getFirebase().db, "listings", listingId),
        buildListingUpdate(input, serverTimestamp()),
      );
    }),

  /** Hide (DRAFT) or publish (PUBLISHED). PENDING_REVIEW is never set by the client. */
  setListingStatus: (listingId: string, status: "PUBLISHED" | "DRAFT") =>
    run(async () => {
      requireUid();
      await updateDoc(doc(getFirebase().db, "listings", listingId), {
        status,
        updatedAt: serverTimestamp(),
      });
    }),

  deleteListing: (listingId: string) =>
    run(async () => {
      requireUid();
      await deleteDoc(doc(getFirebase().db, "listings", listingId));
    }),
};

export type { UserProfileView };
