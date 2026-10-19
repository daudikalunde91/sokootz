import { describe, expect, it } from "vitest";
import { registerSchema, passwordSchema } from "@/lib/validation/auth";
import { ApiError, apiRequest, codeFromStatus } from "@/lib/api/client";

describe("password rule", () => {
  it("rejects passwords shorter than 8 characters", () => {
    expect(passwordSchema.safeParse("abc123").success).toBe(false);
  });
  it("requires a number", () => {
    expect(passwordSchema.safeParse("abcdefgh").success).toBe(false);
  });
  it("accepts 8+ chars with letter and number", () => {
    expect(passwordSchema.safeParse("abcdefg1").success).toBe(true);
  });
});

describe("registration", () => {
  it("rejects mismatched confirmation", () => {
    const r = registerSchema.safeParse({ name: "Asha", email: "a@b.tz", password: "abcdefg1", confirm: "abcdefg2" });
    expect(r.success).toBe(false);
  });
});

describe("api errors", () => {
  it("maps statuses", () => {
    expect(codeFromStatus(401)).toBe("unauthorized");
    expect(codeFromStatus(404)).toBe("not_found");
    expect(codeFromStatus(429)).toBe("rate_limited");
    expect(codeFromStatus(500)).toBe("server");
  });
  it("returns no data when backend is not configured", async () => {
    await expect(apiRequest("/v1/listings/")).rejects.toMatchObject({ code: "not_configured" });
    await expect(apiRequest("/v1/listings/")).rejects.toBeInstanceOf(ApiError);
  });
});
