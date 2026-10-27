/**
 * Categories and regions copied verbatim from the Android app
 * (data/repository/MarketplaceData.kt). Android keeps these in code, not in a
 * Firestore collection, so the website does the same to stay in sync.
 */
export interface Category {
  id: string;
  slug: string;
  nameSw: string;
  nameEn: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: "cat_1", slug: "kilimo", nameSw: "Kilimo & Mazao", nameEn: "Agriculture & Crops" },
  {
    id: "cat_2",
    slug: "elektroniki",
    nameSw: "Elektroniki & Vifaa",
    nameEn: "Electronics & Gadgets",
  },
  { id: "cat_3", slug: "mafundi", nameSw: "Mafundi & Ujenzi", nameEn: "Contractors & Builders" },
  { id: "cat_4", slug: "mitindo", nameSw: "Mitindo & Nguo", nameEn: "Fashion & Apparel" },
  { id: "cat_5", slug: "vyakula", nameSw: "Vyakula & Mikahawa", nameEn: "Food & Restaurants" },
  { id: "cat_6", slug: "usafiri", nameSw: "Usafiri & Magari", nameEn: "Transport & Automotive" },
  { id: "cat_7", slug: "huduma", nameSw: "Huduma za Kitaalamu", nameEn: "Professional Services" },
];

/** "Tanzania Nzima" (all of Tanzania) is Android's "no region filter" value. */
export const ALL_REGIONS = "Tanzania Nzima";
export const REGIONS: readonly string[] = [
  "Dar es Salaam",
  "Arusha",
  "Mwanza",
  "Dodoma",
  "Zanzibar",
  "Mbeya",
  "Morogoro",
  "Tanga",
  "Kilimanjaro",
];

export function categoryBySlug(slug: string | undefined | null): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Android falls back to "Biashara" when a slug is unknown. */
export function categoryNameSw(slug: string): string {
  return categoryBySlug(slug)?.nameSw ?? "Biashara";
}

export const DEFAULT_OPENING_HOURS = "Jumatatu - Jumamosi: 08:00 - 18:00";
