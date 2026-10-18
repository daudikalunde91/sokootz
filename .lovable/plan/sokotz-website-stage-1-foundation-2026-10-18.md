# SokoTZ Website — Stage 1 Foundation

## Audit summary
- The project is a fresh, empty website template with no pages, backend, login or data yet.
- The docs propose a Django REST + PostgreSQL backend (DEC-003, still "Proposed"). Your choice: build the website screens now and connect them to that API later.
- One mismatch to note: the docs mention React/Vite. This project uses React on TanStack Start, which is compatible.
- Rule: no fake listings. Every list shows a proper empty state.

## What gets built
1. **Design system**: dark neon look using your palette (blue-black, navy, electric blue, violet), gradients used only on key buttons and accents, distinctive heading font, visible focus rings, good contrast.
2. **Shared layout**: header with search, mobile menu, footer, language switch (EN/SW, marked as planned), and an Assistant button.
3. **Public pages**: Home (hero search, categories), Categories, Search results with filters, Business profile, Listing detail, About, Contact. Data-driven areas show "no listings yet" states.
4. **Account pages**: Register, Login, Forgot password, Reset password. Forms check input in the browser; submitting shows a clear "accounts open soon" message. No demo login.
5. **Business owner area**: Dashboard, Onboarding, Profile, Listings. Pages show the layout, marked "available after launch of accounts".
6. **Admin area**: route set up only, shows "restricted". No admin tools exposed.
7. **SokoTZ Assistant**: chat panel layout, clearly labeled "coming soon". No AI connected.
8. **Error states**: not found, server error, offline notice, loading skeletons.

## Mobile-app compatibility
- One central API client: configurable base URL, standard error and pagination format, token-based auth (no cookie-only assumptions).
- Shared data types for User, Business, Listing and Category, taken from DATABASE_DESIGN.md.
- A service layer per feature. Right now each one returns "not available" instead of fake data.
- `docs/API_CONTRACTS.md`: proposed endpoints, clearly marked as proposals.

## Docs
- Copy your docs into `docs/`. Update ARCHITECTURE, ROADMAP and DECISIONS (add a frontend stack decision), plus a list of extension points.

## Technical details
- Routes are separate files: `/`, `/categories`, `/search`, `/business/$slug`, `/listing/$id`, `/auth/*`, `/dashboard/*`, `/admin`, `/assistant`, `/about`, `/contact`.
- Tokens go in `src/styles.css` (oklch). `src/lib/api/` holds the client, types and services. Forms use zod.
- Each route gets its own page title and preview metadata.
- Tests: form validation rules and the API error mapping (vitest), plus a Playwright check on desktop, tablet and mobile.

## Not in this stage
Real login, data, payments, AI, the mobile app, and the Django backend itself.
