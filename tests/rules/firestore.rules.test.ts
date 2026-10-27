/**
 * Emulator tests: the website's real write payloads against the Android app's
 * firestore.rules (mirrored in firebase/firestore.rules).
 *
 * Run:  bun run test:rules   (needs Java 11+ and firebase-tools; see TESTING.md)
 */
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Firestore,
} from "firebase/firestore";
import {
  buildBusinessCreate,
  buildBusinessUpdate,
  buildListingCreate,
  buildListingUpdate,
  buildUserProfileCreate,
  buildUserProfileUpdate,
} from "../../src/lib/api/mappers";
import type { BusinessInput, ListingInput } from "../../src/lib/api/types";

let env: RulesTestEnvironment;
const ALICE = "alice_uid";
const BOB = "bob_uid";
const ts = () => serverTimestamp();

const biz: BusinessInput = {
  name: "Duka la Alice",
  categorySlug: "elektroniki",
  city: "Dar es Salaam",
  district: "Kariakoo",
  phoneNumber: "0712345678",
  whatsappNumber: "0712345678",
  descriptionSw: "Simu na vifaa vya umeme",
  descriptionEn: "",
  openingHours: "",
};
const item: ListingInput = {
  titleSw: "Simu ya Tecno",
  titleEn: "Tecno phone",
  descriptionSw: "Mpya kabisa",
  descriptionEn: "",
  priceTzs: 250000,
  categorySlug: "elektroniki",
  type: "PRODUCT",
  city: "Dar es Salaam",
  phoneNumber: "",
  whatsappNumber: "",
  imageUrl: "",
  status: "PUBLISHED",
};
const profile = (role: string) => ({
  displayName: "Alice",
  email: "alice@example.tz",
  phoneNumber: "0712345678",
  role,
  photoUrl: "",
  aiPreferredName: "Alice",
  hasAcceptedTerms: true,
});

const db = (uid: string | null): Firestore =>
  (uid
    ? env.authenticatedContext(uid)
    : env.unauthenticatedContext()
  ).firestore() as unknown as Firestore;

async function seedBusiness(owner = ALICE, id = "biz_alice") {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(
      doc(ctx.firestore() as unknown as Firestore, "businesses", id),
      buildBusinessCreate(owner, biz, serverTimestamp()),
    );
  });
  return id;
}
async function seedListing(owner = ALICE, businessId = "biz_alice", id = "lst_alice") {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(
      doc(ctx.firestore() as unknown as Firestore, "listings", id),
      buildListingCreate(owner, { id: businessId, name: biz.name }, item, serverTimestamp()),
    );
  });
  return id;
}

beforeAll(async () => {
  const [host, port] = (process.env["FIRESTORE_EMULATOR_HOST"] ?? "127.0.0.1:8085").split(":");
  env = await initializeTestEnvironment({
    projectId: "demo-sokotz",
    firestore: {
      rules: readFileSync("firebase/firestore.rules", "utf8"),
      host: host!,
      port: Number(port),
    },
  });
});
afterAll(async () => {
  await env?.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
});

describe("users", () => {
  it("website creates an Android-compatible CUSTOMER profile for its own UID", async () => {
    await assertSucceeds(
      setDoc(
        doc(db(ALICE), "users", ALICE),
        buildUserProfileCreate(ALICE, profile("CUSTOMER"), ts()),
      ),
    );
  });
  it("website creates a BUSINESS_OWNER profile", async () => {
    await assertSucceeds(
      setDoc(
        doc(db(ALICE), "users", ALICE),
        buildUserProfileCreate(ALICE, profile("BUSINESS_OWNER"), ts()),
      ),
    );
  });
  it("a raw ADMIN profile is rejected", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "users", ALICE), {
        ...buildUserProfileCreate(ALICE, profile("CUSTOMER"), ts()),
        role: "ADMIN",
      }),
    );
  });
  it("cannot create a profile for another UID", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "users", BOB), buildUserProfileCreate(BOB, profile("CUSTOMER"), ts())),
    );
  });
  it("website profile update succeeds; role change is rejected", async () => {
    await setDoc(
      doc(db(ALICE), "users", ALICE),
      buildUserProfileCreate(ALICE, profile("CUSTOMER"), ts()),
    );
    await assertSucceeds(
      updateDoc(
        doc(db(ALICE), "users", ALICE),
        buildUserProfileUpdate(
          { displayName: "Alice K", phoneNumber: "", aiPreferredName: "" },
          ts(),
        ),
      ),
    );
    await assertFails(updateDoc(doc(db(ALICE), "users", ALICE), { role: "ADMIN" }));
    await assertFails(updateDoc(doc(db(ALICE), "users", ALICE), { role: "BUSINESS_OWNER" }));
  });
  it("visitors and other users cannot read profiles", async () => {
    await setDoc(
      doc(db(ALICE), "users", ALICE),
      buildUserProfileCreate(ALICE, profile("CUSTOMER"), ts()),
    );
    await assertFails(getDoc(doc(db(null), "users", ALICE)));
    await assertFails(getDoc(doc(db(BOB), "users", ALICE)));
    await assertSucceeds(getDoc(doc(db(ALICE), "users", ALICE)));
  });
});

describe("businesses", () => {
  it("website business create succeeds", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "businesses", "b1"), buildBusinessCreate(ALICE, biz, ts())),
    );
  });
  it("cannot create a business owned by someone else", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "businesses", "b1"), buildBusinessCreate(BOB, biz, ts())),
    );
  });
  it("cannot self-verify on create", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "businesses", "b1"), {
        ...buildBusinessCreate(ALICE, biz, ts()),
        isVerified: true,
      }),
    );
  });
  it("Android's rating 5.0 payload is rejected (documented conflict)", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "businesses", "b1"), {
        ...buildBusinessCreate(ALICE, biz, ts()),
        rating: 5.0,
      }),
    );
  });
  it("owner can edit permitted fields", async () => {
    const id = await seedBusiness();
    await assertSucceeds(
      updateDoc(
        doc(db(ALICE), "businesses", id),
        buildBusinessUpdate({ ...biz, name: "Duka Jipya" }, ts()),
      ),
    );
  });
  it("owner cannot verify own business or change owner", async () => {
    const id = await seedBusiness();
    await assertFails(updateDoc(doc(db(ALICE), "businesses", id), { isVerified: true }));
    await assertFails(updateDoc(doc(db(ALICE), "businesses", id), { ownerId: BOB }));
    await assertFails(updateDoc(doc(db(ALICE), "businesses", id), { rating: 4.5 }));
  });
  it("another user cannot edit the business", async () => {
    const id = await seedBusiness();
    await assertFails(updateDoc(doc(db(BOB), "businesses", id), buildBusinessUpdate(biz, ts())));
  });
  it("visitors can read businesses", async () => {
    await seedBusiness();
    await assertSucceeds(getDocs(collection(db(null), "businesses")));
  });
});

describe("listings", () => {
  it("website listing create under own business succeeds", async () => {
    const b = await seedBusiness();
    await assertSucceeds(
      setDoc(
        doc(db(ALICE), "listings", "l1"),
        buildListingCreate(ALICE, { id: b, name: biz.name }, item, ts()),
      ),
    );
  });
  it("cannot create a listing under another owner's business", async () => {
    const b = await seedBusiness(BOB, "biz_bob");
    await assertFails(
      setDoc(
        doc(db(ALICE), "listings", "l1"),
        buildListingCreate(ALICE, { id: b, name: biz.name }, item, ts()),
      ),
    );
  });
  it("cannot create a self-featured listing", async () => {
    const b = await seedBusiness();
    await assertFails(
      setDoc(doc(db(ALICE), "listings", "l1"), {
        ...buildListingCreate(ALICE, { id: b, name: biz.name }, item, ts()),
        isFeatured: true,
      }),
    );
  });
  it("owner can edit, hide and publish", async () => {
    await seedBusiness();
    const id = await seedListing();
    await assertSucceeds(
      updateDoc(
        doc(db(ALICE), "listings", id),
        buildListingUpdate({ ...item, priceTzs: 200000 }, ts()),
      ),
    );
    await assertSucceeds(
      updateDoc(doc(db(ALICE), "listings", id), { status: "DRAFT", updatedAt: ts() }),
    );
    await assertSucceeds(
      updateDoc(doc(db(ALICE), "listings", id), { status: "PUBLISHED", updatedAt: ts() }),
    );
  });
  it("owner cannot feature own listing or move it to another business", async () => {
    await seedBusiness();
    const id = await seedListing();
    await assertFails(updateDoc(doc(db(ALICE), "listings", id), { isFeatured: true }));
    await assertFails(updateDoc(doc(db(ALICE), "listings", id), { businessId: "biz_other" }));
  });
  it("another user cannot edit or delete the listing", async () => {
    await seedBusiness();
    const id = await seedListing();
    await assertFails(updateDoc(doc(db(BOB), "listings", id), buildListingUpdate(item, ts())));
    await assertFails(deleteDoc(doc(db(BOB), "listings", id)));
  });
  it("signed-in viewer can record one view (+1 only)", async () => {
    await seedBusiness();
    const id = await seedListing();
    await assertSucceeds(setDoc(doc(db(BOB), "listings", id, "viewers", BOB), { viewedAt: ts() }));
    await assertSucceeds(
      updateDoc(doc(db(BOB), "listings", id), { viewsCount: increment(1), updatedAt: ts() }),
    );
    await assertFails(
      updateDoc(doc(db(BOB), "listings", id), { viewsCount: increment(5), updatedAt: ts() }),
    );
  });
  it("owner can delete own listing", async () => {
    await seedBusiness();
    const id = await seedListing();
    await assertSucceeds(deleteDoc(doc(db(ALICE), "listings", id)));
  });
  it("visitors can run the website's public query (status == PUBLISHED)", async () => {
    await seedBusiness();
    await seedListing();
    await assertSucceeds(
      getDocs(query(collection(db(null), "listings"), where("status", "==", "PUBLISHED"))),
    );
  });
});
