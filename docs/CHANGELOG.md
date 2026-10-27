# Changelog

## 2026-10-23 — Firebase integration with the Android app
Added
- `src/lib/firebase/config.ts`, `client.ts` — web config resolution and lazy client init; explicitly selects the Android named Firestore DB; optional emulators.
- `src/lib/api/types.ts` (rewritten) — Android-exact `UserProfileDoc`/`BusinessDoc`/`ListingDoc` plus website view models.
- `src/lib/api/mappers.ts` — doc ↔ view adapters, privileged-field-safe write builders, TZS/phone/WhatsApp/image helpers.
- `src/lib/api/services.ts` (rewritten) — Firestore reads/writes for listings, businesses, profiles and owner operations; unique-view counting like Android.
- `src/lib/api/queries.ts`, `src/lib/marketplace/{catalog,search,images,owner,useContentLang}.ts`.
- `src/lib/auth/{AuthProvider.tsx,errors.ts,redirect.ts}` — Firebase Auth session, profile sync, bilingual errors.
- Components: `FormField`, `DataForm`, `BusinessForm`, `ListingCard`, `ContactButtons`, `CategoryGrid`.
- `firebase.json`, `firebase/firestore.rules` (mirror), `tests/rules/firestore.rules.test.ts`, `vitest.rules.config.ts`, `test:rules` script.
- Tests: `firebase-config`, `marketplace-mapping`, `search`, expanded `rules` unit tests.
- Docs: AUDIT_REPORT, FIREBASE_SETUP, TESTING, this changelog; `.env.example`.

Changed
- `src/lib/api/client.ts` — removed the Django `apiRequest`/`VITE_API_BASE_URL`; kept `ApiError`; added Firebase error mapping.
- `AuthForm` — real submission, Google button, success/error states; auth routes wired to Firebase (reset uses `oobCode`).
- Registration adds phone, account type and terms (matches Android).
- Home, search, categories, listing and business pages read real Firestore data with loading/empty/offline/permission/index states and pagination.
- `/business/$slug` → `/business/$id` (Firestore document ID).
- Dashboard: real guard, overview, onboarding, profile and listings management.
- Header shows account state and logout; root mounts `AuthProvider` and the toast host.
- Assistant: retrieves real PUBLISHED listings for each question and links them; prompt updated.
- Architecture, database, security, API and roadmap docs updated to the implemented design.

Removed
- `src/test/auth-availability.test.tsx` (tested the old "accounts disabled" behaviour).
- `src/routes/business.$slug.tsx`.

Android app: **not modified.** Recommended Android changes are listed in AUDIT_REPORT §3.
