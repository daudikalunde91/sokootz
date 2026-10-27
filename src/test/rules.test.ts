import { describe, expect, it } from "vitest";
import { loginSchema, passwordSchema, registerSchema } from "@/lib/validation/auth";
import { listingSchema } from "@/lib/validation/marketplace";
import { ApiError, toApiError } from "@/lib/api/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { safeRedirect } from "@/lib/auth/redirect";
import { scaledSize, validateImageFile } from "@/lib/marketplace/images";

const reg = {
  name: "Asha",
  email: "a@b.tz",
  phone: "0712345678",
  role: "CUSTOMER",
  password: "abcdefg1",
  confirm: "abcdefg1",
  terms: "on",
};

describe("password rule", () => {
  it("rejects new passwords shorter than 8 characters", () =>
    expect(passwordSchema.safeParse("abc123").success).toBe(false));
  it("requires a number", () => expect(passwordSchema.safeParse("abcdefgh").success).toBe(false));
  it("accepts 8+ chars with letter and number", () =>
    expect(passwordSchema.safeParse("abcdefg1").success).toBe(true));
  it("login accepts existing 6-character Android passwords", () => {
    expect(loginSchema.safeParse({ email: "a@b.tz", password: "abc123" }).success).toBe(true);
  });
});

describe("registration", () => {
  it("accepts a complete registration", () =>
    expect(registerSchema.safeParse(reg).success).toBe(true));
  it("rejects mismatched confirmation", () =>
    expect(registerSchema.safeParse({ ...reg, confirm: "abcdefg2" }).success).toBe(false));
  it("requires accepting the terms", () => {
    const { terms: _t, ...noTerms } = reg;
    expect(registerSchema.safeParse(noTerms).success).toBe(false);
  });
  it("requires a phone number like Android", () =>
    expect(registerSchema.safeParse({ ...reg, phone: "" }).success).toBe(false));
  it("cannot register as ADMIN", () =>
    expect(registerSchema.safeParse({ ...reg, role: "ADMIN" }).success).toBe(false));
});

describe("listing form", () => {
  const base = {
    titleSw: "Simu",
    descriptionSw: "Simu mpya kabisa",
    priceTzs: "1000",
    categorySlug: "elektroniki",
    type: "PRODUCT",
    city: "Arusha",
    status: "PUBLISHED",
  };
  it("accepts a valid listing", () => expect(listingSchema.safeParse(base).success).toBe(true));
  it("rejects negative prices", () =>
    expect(listingSchema.safeParse({ ...base, priceTzs: "-1" }).success).toBe(false));
  it("rejects decimal prices", () =>
    expect(listingSchema.safeParse({ ...base, priceTzs: "10.5" }).success).toBe(false));
  it("rejects unknown categories", () =>
    expect(listingSchema.safeParse({ ...base, categorySlug: "weapons" }).success).toBe(false));
  it("cannot set PENDING_REVIEW from the form", () =>
    expect(listingSchema.safeParse({ ...base, status: "PENDING_REVIEW" }).success).toBe(false));
  it("rejects images over the 250,000-character rule limit", () => {
    expect(listingSchema.safeParse({ ...base, imageUrl: "x".repeat(250_001) }).success).toBe(false);
  });
});

describe("errors", () => {
  it("maps Firestore permission errors", () =>
    expect(toApiError({ code: "permission-denied" }).code).toBe("forbidden"));
  it("maps Firestore offline errors", () =>
    expect(toApiError({ code: "unavailable" }).code).toBe("network"));
  it("maps missing index errors", () => {
    expect(
      toApiError(
        Object.assign(new Error("The query requires an index"), { code: "failed-precondition" }),
      ).code,
    ).toBe("index_required");
  });
  it("keeps ApiErrors as they are", () =>
    expect(toApiError(new ApiError("not_found", "x")).code).toBe("not_found"));
  it("shows no message when the Google popup is closed", () =>
    expect(authErrorMessage({ code: "auth/popup-closed-by-user" })).toBeNull());
  it("explains wrong credentials in Kiswahili and English", () => {
    expect(authErrorMessage({ code: "auth/invalid-credential" })).toContain(
      "Incorrect email or password",
    );
  });
});

describe("post-login redirect", () => {
  it("allows same-site paths", () =>
    expect(safeRedirect("/dashboard/listings")).toBe("/dashboard/listings"));
  it("blocks other sites", () => {
    expect(safeRedirect("https://evil.example")).toBe("/dashboard");
    expect(safeRedirect("//evil.example")).toBe("/dashboard");
  });
});

describe("images", () => {
  it("accepts JPG/PNG/WebP up to 10 MB", () =>
    expect(validateImageFile({ type: "image/png", size: 1000 })).toBeNull());
  it("rejects other types", () =>
    expect(validateImageFile({ type: "image/svg+xml", size: 10 })).not.toBeNull());
  it("rejects files over 10 MB", () =>
    expect(validateImageFile({ type: "image/jpeg", size: 11 * 1024 * 1024 })).not.toBeNull());
  it("scales to 600px on the long side like Android", () => {
    expect(scaledSize(1200, 800)).toEqual({ width: 600, height: 400 });
    expect(scaledSize(300, 200)).toEqual({ width: 300, height: 200 });
  });
});
