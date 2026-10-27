# SokoTZ website

Tanzania-first marketplace for businesses, products and services. The website shares accounts and marketplace data with the SokoTZ Android app through the same Firebase project and named Firestore database.

**Live app**: https://sokootz.lovable.app

## What works
- Accounts: email/password, Google, logout, password reset, session restore (Firebase Auth).
- Marketplace: home, categories, search with type/category/region filters, listing and business pages, call/WhatsApp contact.
- Business owners: onboarding, business profile editing, listings (create, edit, hide/publish, delete, photo).
- SokoTZ Assistant (Kiswahili/English): platform help, listing-text drafting, and answers grounded in real published listings. See [docs/SOKOTZ_ASSISTANT.md](docs/SOKOTZ_ASSISTANT.md).

## Setup
Copy `.env.example` and set `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_APP_ID` from the Firebase Web App. Full steps: [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).

```sh
npm i
npm run dev
npm test            # unit tests
npm run test:rules  # Firestore rule tests (Java + firebase-tools)
```

Docs: [Audit report](docs/AUDIT_REPORT.md) · [Testing](docs/TESTING.md) · [Changelog](docs/CHANGELOG.md) · [Architecture](docs/ARCHITECTURE.md) · [Data contracts](docs/API_CONTRACTS.md)

Built with [Lovable](https://lovable.dev/projects/b48c3ef9-2cb9-4394-bfba-bf65c25276e0).
