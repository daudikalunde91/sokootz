# SokoTZ — Data Contracts (IMPLEMENTED)

Status: **Implemented 2026-10-23.** The website and the Android app share one Firebase project and the named Firestore DB `ai-studio-android-sokotz-17bca192-1896-4b7e-b183-ea8b41319929`. The earlier proposed Django REST contract is **superseded** (see DECISIONS.md DEC-020). There is no custom REST API.

## Conventions
- Auth: Firebase Authentication (email/password, Google). Identity = Firebase UID.
- IDs: Firestore document IDs (opaque strings). Timestamps: Firestore `Timestamp` via `serverTimestamp()`.
- Enums are upper-case: roles `CUSTOMER|BUSINESS_OWNER|ADMIN`, type `PRODUCT|SERVICE`, status `PUBLISHED|PENDING_REVIEW|DRAFT`.
- Field names are defined by Android `MarketplaceModels.kt`; see `src/lib/api/types.ts`. Do not rename without a migration plan.

## Collections
| Path | Read | Write (enforced by firestore.rules) |
|---|---|---|
| `users/{uid}` | owner only | create own (role ≠ ADMIN); update own (role/userId immutable) |
| `businesses/{id}` | public | create with own `ownerId`, `isVerified=false`, `rating=0`, `reviewCount=0`; owner updates without changing owner/verification/rating |
| `listings/{id}` | public | create under own business, `isFeatured=false`, `viewsCount=0`; owner updates without changing owner/business/featured; anyone signed in may +1 `viewsCount` |
| `listings/{id}/viewers/{uid}` | signed in | create own |

## Website operations (`src/lib/api/services.ts`)
| Operation | Firestore call |
|---|---|
| Public catalogue | `listings where status == PUBLISHED limit 500` (filtered/paginated in browser) |
| Listing detail | `get listings/{id}`; non-PUBLISHED returned only to its owner |
| Business detail + listings | `get businesses/{id}`; `listings where businessId == id and status == PUBLISHED` |
| My business | `businesses where ownerId == uid limit 1` |
| My listings | `listings where ownerId == uid` |
| Create/update business/listing | `addDoc` / partial `updateDoc` built by `mappers.ts` |
| Hide / publish | `updateDoc {status: DRAFT|PUBLISHED}` |
| Delete listing | `deleteDoc` |

## Server route
`POST /api/assistant` — body `{ lang, messages[], listings[] }`; `listings` are public listings already retrieved by the browser (max 8, validated). Streams text. Credentials stay server-side.
