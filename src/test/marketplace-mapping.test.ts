import { describe, expect, it } from "vitest";
import {
  buildBusinessCreate,
  buildBusinessUpdate,
  buildListingCreate,
  buildListingUpdate,
  buildUserProfileCreate,
  buildUserProfileUpdate,
  formatTzs,
  isPubliclyVisible,
  localized,
  normalizeTzPhone,
  safeImageSrc,
  toBusinessView,
  toListingView,
  toUserProfileView,
  whatsappHref,
} from "@/lib/api/mappers";
import type { BusinessInput, ListingInput } from "@/lib/api/types";

const TS = "__server_timestamp__";
const bizInput: BusinessInput = {
  name: " Duka la Asha ",
  categorySlug: "elektroniki",
  city: "Dar es Salaam",
  district: "Kariakoo",
  phoneNumber: "0712345678",
  whatsappNumber: "",
  descriptionSw: "Simu na vifaa",
  descriptionEn: "",
  openingHours: "",
};
const listingInput: ListingInput = {
  titleSw: "Simu ya Tecno",
  titleEn: "",
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

describe("user profile documents (users/{uid})", () => {
  it("uses the Firebase UID as userId", () => {
    expect(
      buildUserProfileCreate(
        "uid-1",
        {
          displayName: "Asha",
          email: "a@b.tz",
          phoneNumber: "",
          role: "CUSTOMER",
          photoUrl: "",
          aiPreferredName: "",
          hasAcceptedTerms: true,
        },
        TS,
      ).userId,
    ).toBe("uid-1");
  });
  it("can never create an ADMIN profile", () => {
    expect(
      buildUserProfileCreate(
        "u",
        {
          displayName: "x",
          email: "",
          phoneNumber: "",
          role: "ADMIN",
          photoUrl: "",
          aiPreferredName: "",
          hasAcceptedTerms: true,
        },
        TS,
      ).role,
    ).toBe("CUSTOMER");
  });
  it("keeps BUSINESS_OWNER when chosen at registration", () => {
    expect(
      buildUserProfileCreate(
        "u",
        {
          displayName: "x",
          email: "",
          phoneNumber: "",
          role: "BUSINESS_OWNER",
          photoUrl: "",
          aiPreferredName: "",
          hasAcceptedTerms: true,
        },
        TS,
      ).role,
    ).toBe("BUSINESS_OWNER");
  });
  it("uses Android's default name when none is given", () => {
    expect(
      buildUserProfileCreate(
        "u",
        {
          displayName: " ",
          email: "",
          phoneNumber: "",
          role: "CUSTOMER",
          photoUrl: "",
          aiPreferredName: "",
          hasAcceptedTerms: true,
        },
        TS,
      ).displayName,
    ).toBe("Mwanachama SokoTZ");
  });
  it("profile updates never include role or userId", () => {
    const u = buildUserProfileUpdate(
      { displayName: "A", phoneNumber: "", aiPreferredName: "" },
      TS,
    );
    expect(u).not.toHaveProperty("role");
    expect(u).not.toHaveProperty("userId");
  });
  it("reads unknown roles as CUSTOMER", () => {
    expect(toUserProfileView("u", { role: "SUPERUSER" }).role).toBe("CUSTOMER");
  });
});

describe("business documents", () => {
  const created = buildBusinessCreate("owner-1", bizInput, TS);
  it("sets ownerId from the authenticated UID", () => expect(created.ownerId).toBe("owner-1"));
  it("starts unverified", () => expect(created.isVerified).toBe(false));
  it("starts with no rating and no reviews", () => {
    expect(created.rating).toBe(0);
    expect(created.reviewCount).toBe(0);
  });
  it("writes Android's categoryName and address format", () => {
    expect(created.categoryName).toBe("Elektroniki & Vifaa");
    expect(created.address).toBe("Kariakoo, Dar es Salaam");
  });
  it("updates never touch ownerId, isVerified, rating or reviewCount", () => {
    const u = buildBusinessUpdate(bizInput, TS);
    for (const k of ["ownerId", "isVerified", "rating", "reviewCount"])
      expect(u).not.toHaveProperty(k);
  });
  it("only an explicit isVerified true shows as verified", () => {
    expect(toBusinessView("b", { verified: true }).isVerified).toBe(false);
    expect(toBusinessView("b", { isVerified: true }).isVerified).toBe(true);
  });
});

describe("listing documents", () => {
  const created = buildListingCreate(
    "owner-1",
    { id: "biz-1", name: "Duka la Asha" },
    listingInput,
    TS,
  );
  it("links to the owner's own business", () => {
    expect(created.businessId).toBe("biz-1");
    expect(created.ownerId).toBe("owner-1");
    expect(created.businessName).toBe("Duka la Asha");
  });
  it("is never self-featured and starts at 0 views", () => {
    expect(created.isFeatured).toBe(false);
    expect(created.viewsCount).toBe(0);
  });
  it("uses Android enum values", () => {
    expect(created.type).toBe("PRODUCT");
    expect(created.status).toBe("PUBLISHED");
  });
  it("stores priceTzs as a whole number", () => {
    expect(
      buildListingCreate("o", { id: "b", name: "n" }, { ...listingInput, priceTzs: 1500.7 }, TS)
        .priceTzs,
    ).toBe(1500);
  });
  it("hidden listings are written as DRAFT", () => {
    expect(
      buildListingCreate("o", { id: "b", name: "n" }, { ...listingInput, status: "DRAFT" }, TS)
        .status,
    ).toBe("DRAFT");
  });
  it("falls back to the Kiswahili title for English", () =>
    expect(created.titleEn).toBe("Simu ya Tecno"));
  it("updates never touch ownerId, businessId, isFeatured or viewsCount", () => {
    const u = buildListingUpdate(listingInput, TS);
    for (const k of ["ownerId", "businessId", "isFeatured", "viewsCount"])
      expect(u).not.toHaveProperty(k);
  });
  it("treats a missing status as PUBLISHED like Android", () => {
    expect(toListingView("l", {}).status).toBe("PUBLISHED");
  });
  it("only PUBLISHED listings are public", () => {
    expect(isPubliclyVisible({ status: "PUBLISHED" })).toBe(true);
    expect(isPubliclyVisible({ status: "DRAFT" })).toBe(false);
    expect(isPubliclyVisible({ status: "PENDING_REVIEW" })).toBe(false);
  });
});

describe("display helpers", () => {
  it("formats TZS without decimals", () => expect(formatTzs(250000)).toBe("TZS 250,000"));
  it("Kiswahili is canonical; English falls back to it", () => {
    expect(localized("Simu", "", "en")).toBe("Simu");
    expect(localized("Simu", "Phone", "en")).toBe("Phone");
    expect(localized("Simu", "Phone", "sw")).toBe("Simu");
  });
  it("normalises Tanzanian numbers for WhatsApp", () => {
    expect(normalizeTzPhone("0712 345 678")).toBe("255712345678");
    expect(normalizeTzPhone("+255 712 345 678")).toBe("255712345678");
    expect(normalizeTzPhone("712345678")).toBe("255712345678");
    expect(whatsappHref("0712345678")).toBe("https://wa.me/255712345678");
  });
  it("rejects unusable phone numbers", () => {
    expect(normalizeTzPhone("12345")).toBeNull();
    expect(normalizeTzPhone("2557123")).toBeNull();
    expect(whatsappHref("")).toBeNull();
  });
  it("accepts Android base64 images and https URLs only", () => {
    expect(safeImageSrc("/9j/4AAQ")).toBe("data:image/jpeg;base64,/9j/4AAQ");
    expect(safeImageSrc("data:image/jpeg;base64,AAAA")).toBe("data:image/jpeg;base64,AAAA");
    expect(safeImageSrc("https://x.tz/a.jpg")).toBe("https://x.tz/a.jpg");
    expect(safeImageSrc("javascript:alert(1)")).toBeNull();
    expect(safeImageSrc("http://x.tz/a.jpg")).toBeNull();
    expect(safeImageSrc("")).toBeNull();
  });
});
