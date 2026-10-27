# SokoTZ Website ↔ Android Integration — Audit Report

Date: 2026-10-23. Sources inspected:
- Website: `sokootz-website.zip` (TanStack Start + React + Tailwind, Lovable project).
- Android: `github.com/daudikalunde91/sokoTZ` at commit `9c6ea38` (the `sokotz(1).zip` named in the brief was not supplied; the owner pointed to this repository instead). `app/google-services.json` is not committed to the repo; it was read from the `sokoTZ.zip` archive committed inside the repository.

## 1. Verified facts from the Android source

| Item | Value | Source |
|---|---|---|
| Firebase project | `gen-lang-client-0905574889` (number 276149702266) | `google-services.json` |
| Android package | `com.aistudio.sokotz.kzqm` | `google-services.json` |
| Firestore DB | named `ai-studio-android-sokotz-17bca192-1896-4b7e-b183-ea8b41319929` | `firebase_applet_config.xml`, `firebase.json`, `FirebaseFirestore.getInstance(dbId)` |
| `(default)` DB | **does not exist** (Firestore REST returns 404) | live check |
| Collections | `users/{uid}`, `businesses/{autoId}`, `listings/{autoId}`, `listings/{id}/viewers/{uid}` | repository + rules |
| Categories / regions | hard-coded list (7 slugs, 9 regions + "Tanzania Nzima") — no collection | `MarketplaceData.kt` |
| Listing images | inline JPEG data URI in `imageUrl`, ≤600px, ≤250,000 chars; no Cloud Storage | `ImageUtils.kt`, rules |
| Enums | `CUSTOMER/BUSINESS_OWNER/ADMIN`, `PRODUCT/SERVICE`, `PUBLISHED/PENDING_REVIEW/DRAFT` | `MarketplaceModels.kt` |
| Listing lifecycle | Android creates listings directly as `PUBLISHED`; no moderation step exists | `createListing()` |
| One business per owner | Android uses the first business with `ownerId == uid` | `BusinessHubScreen.kt` |
| Auth | Email/password, Google (Credential Manager), password reset email | `AuthManager.kt` |
| Profile creation | read `users/{uid}`; create if missing with pending registration data | `loadOrCreateUserProfile()` |
| AI | Gemini REST from the device with `BuildConfig.GEMINI_API_KEY` | `GeminiService.kt` |

## 2. Differences found in the website and how they were fixed

| Website before | Problem | Fix |
|---|---|---|
| `src/lib/api/*` called a non-existent Django API via `VITE_API_BASE_URL` | No backend; second source of truth proposed | Replaced with Firebase JS SDK services on the Android project + named DB. `VITE_API_BASE_URL` removed. |
| Types used `slug`, nested `business`, `images[]`, lowercase statuses | Incompatible with Firestore docs | `*Doc` types mirror Android exactly; explicit adapters (`src/lib/api/mappers.ts`) convert to view models. Website never writes view models. |
| `/business/$slug` | Android has no slugs | `/business/$id` uses the Firestore document ID (URL shape unchanged). |
| Categories fetched from `/v1/categories/` | No such collection | Same static list as Android. |
| `AuthForm` hard-disabled (`accountsAvailable = false`) | No accounts | Real Firebase Auth: register, login, Google popup, logout, reset email, reset confirmation (`oobCode`), session restore, bilingual errors. |
| Dashboard pages were "Planned" placeholders | No owner features | Onboarding, business editing, account editing, listing create/edit/hide/publish/delete, image upload. |
| Assistant said "no listings available" | Marketplace now real | Browser retrieves matching PUBLISHED listings with the same visibility rule as search and sends only those to the server route as data; replies link to the real listings. Provider unchanged (Lovable AI Gateway). |

## 3. Security findings

### 3.1 Deployed rules differ from the repository rules — **important**
An unauthenticated Firestore REST list of `listings` and `businesses` on the named DB returns `403 PERMISSION_DENIED`, while the repository `firestore.rules` allows `list: if true`. The rules **deployed** to the project are therefore not the repository version (likely stricter, e.g. sign-in required). Consequences:
- Guest browsing on the website may show "Sign-in required" until the repository rules are deployed (or until the visitor logs in).
- Every website write was tested only against the **repository** rules (emulator). Behaviour against the unknown deployed rules is **unverified**.
Action: deploy the repository rules from the Android project (`firebase deploy --only firestore:rules`) after review, or share the deployed rules so they can be tested.

### 3.2 Android business creation is rejected by the repository rules
Android writes `rating: 5.0`; the rules require `rating == 0` on create. Android business registration therefore fails against these rules (verified in the emulator: test "Android's rating 5.0 payload is rejected"). It would also display a fabricated 5.0 rating. The website writes `rating: 0, reviewCount: 0` and shows ratings only when `reviewCount > 0`. **Android change recommended** (not made — out of scope): write `rating: 0`.

### 3.3 Android role updates are rejected
`AuthManager.updateUserRole()` and the "merge pending registration" path write `role`, but the rules make `role` immutable. These Android calls fail silently. The website never updates `role`; it is chosen once at registration (CUSTOMER or BUSINESS_OWNER, never ADMIN).

### 3.4 Listing visibility is enforced only by clients
Rules allow anyone to read every listing, including `DRAFT`/`PENDING_REVIEW`, and do not restrict `status` on create/update. The website only shows `PUBLISHED` listings publicly and only lets owners set `PUBLISHED` or `DRAFT`, but hidden listings are still readable through the API. Android's own lists do not filter by status. Recommended rule change (requires an Android-side review first): `allow list: if resource.data.status == 'PUBLISHED' || resource.data.ownerId == request.auth.uid`.

### 3.5 Kotlin `is`-prefixed booleans (observation, not verified at runtime)
`BusinessProfile.isVerified` and `Listing.isFeatured` are Kotlin `val isX: Boolean`. Firestore's Android mapper derives property names from getters, which commonly maps these to `verified`/`featured` when reading. Writes use explicit maps (`"isVerified"`), so documents contain `isVerified`, but Android may read them as `false`. The website reads `isVerified`/`isFeatured` and treats only an explicit `true` as verified/featured.

### 3.6 Gemini key on device
Android ships the Gemini API key in the APK (`BuildConfig.GEMINI_API_KEY`), which is extractable. The website keeps its AI credentials server-side only. Recommend moving Android AI calls behind a server endpoint.

### 3.7 Website controls added
- Payload builders fix privileged fields (`ownerId` from Auth UID; `isVerified=false`, `rating=0`, `reviewCount=0`, `isFeatured=false`, `viewsCount=0`; role never ADMIN). Partial updates never send `ownerId`, `businessId`, `isVerified`, `rating`, `reviewCount`, `isFeatured`, `viewsCount` or `role`.
- Listings are created under the owner's own business looked up by UID, never a client-supplied business ID.
- Images: type/size validated, re-encoded through a canvas (strips metadata), limited to the rule size; only `data:image/*`, raw Android base64 and `https:` image sources are rendered.
- Same-site-only post-login redirects; password reset doesn't reveal whether an account exists.
- No secrets in browser code. The Firebase web config (API key, app ID) is publishable by design; access is controlled by Security Rules.

## 4. Remaining limitations
- **Web App keys not yet supplied.** Until `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_APP_ID` are set, the site shows "Marketplace not connected yet" and account forms are disabled. See FIREBASE_SETUP.md.
- Search loads up to 500 PUBLISHED listings and filters in the browser (Firestore has no full-text search), same approach as Android. Beyond that, a search service or Algolia/Typesense extension is needed.
- Listings without a `status` field are treated as PUBLISHED by Android but cannot be matched by the website's `status == "PUBLISHED"` query.
- Renaming a business does not update `businessName` on existing listings (same as Android).
- Business deletion is not offered (Android doesn't offer it; listings would be orphaned).
- No admin tools (verification, featuring, moderation) on either client; these need a trusted server with the Admin SDK.
- Dashboard guard is client-side (Firebase sessions live in the browser); Firestore rules are the actual enforcement.
- Android may overwrite a website-entered English title/description with the Kiswahili text when the owner edits the listing in the app (`updateListing` writes the same text to both).
