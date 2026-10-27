import { describe, expect, it } from "vitest";
import { toListingView } from "@/lib/api/mappers";
import { filterListings, paginate, rankForAssistant } from "@/lib/marketplace/search";

const ts = (ms: number) => ({ toDate: () => new Date(ms) });
const all = [
  toListingView("a", {
    titleSw: "Simu ya Tecno",
    businessName: "Duka A",
    categorySlug: "elektroniki",
    type: "PRODUCT",
    city: "Dar es Salaam",
    status: "PUBLISHED",
    createdAt: ts(1),
  }),
  toListingView("b", {
    titleSw: "Fundi bomba",
    businessName: "Mafundi B",
    categorySlug: "mafundi",
    type: "SERVICE",
    city: "Arusha",
    status: "PUBLISHED",
    createdAt: ts(3),
  }),
  toListingView("c", {
    titleSw: "Simu iliyofichwa",
    businessName: "Duka A",
    categorySlug: "elektroniki",
    type: "PRODUCT",
    city: "Dar es Salaam",
    status: "DRAFT",
    createdAt: ts(2),
  }),
  toListingView("d", {
    titleSw: "Simu inasubiri",
    businessName: "Duka A",
    categorySlug: "elektroniki",
    type: "PRODUCT",
    city: "Dar es Salaam",
    status: "PENDING_REVIEW",
  }),
];

describe("marketplace search", () => {
  it("never returns DRAFT or PENDING_REVIEW listings", () => {
    expect(filterListings(all, {}).map((l) => l.id)).toEqual(["b", "a"]);
  });
  it("filters by category slug", () => {
    expect(filterListings(all, { category: "mafundi" }).map((l) => l.id)).toEqual(["b"]);
  });
  it("filters products vs services", () => {
    expect(filterListings(all, { type: "service" }).map((l) => l.id)).toEqual(["b"]);
    expect(filterListings(all, { type: "product" }).map((l) => l.id)).toEqual(["a"]);
  });
  it("filters by region; Tanzania Nzima means all regions", () => {
    expect(filterListings(all, { region: "Arusha" }).map((l) => l.id)).toEqual(["b"]);
    expect(filterListings(all, { region: "Tanzania Nzima" })).toHaveLength(2);
  });
  it("matches every search word, case-insensitively", () => {
    expect(filterListings(all, { q: "SIMU tecno" }).map((l) => l.id)).toEqual(["a"]);
    expect(filterListings(all, { q: "simu bomba" })).toHaveLength(0);
  });
  it("paginates with a stable page count", () => {
    const p = paginate([1, 2, 3, 4, 5], 2, 2);
    expect(p.results).toEqual([3, 4]);
    expect(p.pageCount).toBe(3);
  });
  it("assistant retrieval only uses public listings", () => {
    expect(rankForAssistant(all, "natafuta simu").map((l) => l.id)).toEqual(["a"]);
  });
  it("assistant retrieval ignores filler words", () => {
    expect(rankForAssistant(all, "how can you help")).toHaveLength(0);
  });
});
