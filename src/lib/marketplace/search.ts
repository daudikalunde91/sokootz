/**
 * Client-side search over public listings. Firestore has no full-text search,
 * so (like Android's filterListings) the site loads a bounded set of PUBLISHED
 * listings and filters in memory. See docs/FIREBASE_SETUP.md for the limits.
 */
import { ALL_REGIONS } from "./catalog";
import { isPubliclyVisible } from "@/lib/api/mappers";
import type { ListingView, Page, SearchParams } from "@/lib/api/types";

export const PAGE_SIZE = 24;

function haystack(l: ListingView) {
  return [l.titleSw, l.titleEn, l.descriptionSw, l.descriptionEn, l.businessName]
    .join(" ")
    .toLowerCase();
}

export function terms(q: string | undefined): string[] {
  return (q ?? "")
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function filterListings(all: ListingView[], p: SearchParams): ListingView[] {
  const words = terms(p.q);
  const type = p.type ? p.type.toUpperCase() : null;
  const region = p.region && p.region !== ALL_REGIONS ? p.region.trim().toLowerCase() : null;
  return all
    .filter(isPubliclyVisible)
    .filter((l) => {
      if (p.category && p.category !== "all" && l.categorySlug !== p.category) return false;
      if (type && l.type !== type) return false;
      if (region && l.city.trim().toLowerCase() !== region) return false;
      if (words.length) {
        const h = haystack(l);
        if (!words.every((w) => h.includes(w))) return false;
      }
      return true;
    })
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export function paginate<T>(items: T[], page = 1, size = PAGE_SIZE): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pageCount);
  return {
    results: items.slice((current - 1) * size, current * size),
    count: items.length,
    page: current,
    pageCount,
  };
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "are",
  "can",
  "how",
  "what",
  "where",
  "who",
  "need",
  "want",
  "find",
  "looking",
  "please",
  "any",
  "have",
  "near",
  "sell",
  "buy",
  "nina",
  "kwa",
  "nataka",
  "natafuta",
  "tafuta",
  "naomba",
  "wapi",
  "gani",
  "nini",
  "hii",
  "hiyo",
  "kuna",
  "bei",
  "nawezaje",
  "yangu",
  "wangu",
  "kwenye",
  "pia",
  "sana",
]);

/** Ranked loose match for the Assistant: any meaningful word (3+ chars, not a stopword) counts. */
export function rankForAssistant(all: ListingView[], message: string, max = 6): ListingView[] {
  const words = terms(message)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  if (!words.length) return [];
  return all
    .filter(isPubliclyVisible)
    .map((l) => {
      const h = `${haystack(l)} ${l.categorySlug} ${l.city.toLowerCase()}`;
      return { l, score: words.filter((w) => h.includes(w)).length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.l);
}
