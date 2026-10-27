# SokoTZ website — testing

Results below were recorded on 2026-10-23 in the Lovable sandbox.

## Unit tests (ran)
```sh
bunx vitest run
```
Result: **5 files, 67 tests passed** — Firebase config and named-DB selection, Android model mapping, privileged-field stripping, role/self-verify/self-feature guards, search/category/type/region filters and listing visibility, validation, error mapping, safe redirects, image limits, routing.

## Firestore security-rule tests (ran, emulator)
```sh
bun run test:rules   # firebase emulators:exec --only firestore … vitest --config vitest.rules.config.ts
```
Requires Java 11+ and `firebase-tools`. Result: **23 tests passed** against `firebase/firestore.rules` (byte-identical mirror of Android commit 9c6ea38), using the website's real payload builders:
- users: own CUSTOMER/BUSINESS_OWNER profile ✓; ADMIN ✗; other UID ✗; role change ✗; private reads ✗.
- businesses: create ✓; for another owner ✗; self-verified ✗; Android `rating: 5.0` ✗ (documented conflict); owner edit ✓; self-verify/owner change/rating change ✗; other user edit ✗; public read ✓.
- listings: create under own business ✓; under another's ✗; self-featured ✗; edit/hide/publish ✓; self-feature / move business ✗; other user edit/delete ✗; unique view +1 ✓ / +5 ✗; owner delete ✓; public `status == PUBLISHED` query ✓.

## End-to-end browser flow (ran, emulators)
Playwright against the website with `VITE_FIREBASE_USE_EMULATORS=true` and Auth + Firestore emulators. All steps passed: register (business owner) → dashboard → create business → add listing with photo → search finds it → listing page (TZS 250,000) → business page with its listings → session survives reload → logout → guest search shows listing → dashboard redirects guest to login → wrong password shows bilingual error → login → hide listing → it disappears from public search.

## Assistant (ran)
`POST /api/assistant` with one retrieved listing returned a Kiswahili answer naming only that listing, its seller, city and price.

## Type-check (ran)
`tsgo --noEmit` — no errors. Production build is run automatically by Lovable on each change.

## Not run / not verifiable here
- Anything against the **real** Firebase project: the Web App `apiKey`/`appId` have not been supplied, and the website must not create test accounts or records in production.
- Google sign-in (needs real keys + authorized domain; the Auth emulator popup was not exercised).
- Behaviour against the **deployed** production rules (they differ from the repository; see AUDIT_REPORT §3.1).
- Android app tests (Gradle/Robolectric) — the Android project was not modified.
