# SokoTZ — API Contracts (PROPOSED)

Status: **Proposed. No backend exists yet.** These are what the website expects; the Django API and mobile app should follow them or this file must be updated.

## Conventions
- Base URL from `VITE_API_BASE_URL` (web). Versioned paths: `/v1/...`.
- Auth: `Authorization: Bearer <access token>`. No cookie-only auth, so mobile works identically.
- IDs are opaque strings. Timestamps ISO 8601 UTC.
- Lists return `{ results, count, next, previous }`; `?page=N`.
- Errors return `{ detail: string, errors?: { field: string[] } }`. Status mapping: 400/422 validation, 401 unauthorized, 403 forbidden, 404 not found, 429 rate limited, 5xx server.

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | /v1/categories/ | List categories |
| GET | /v1/listings/?q&category&region&type&page | Search published listings |
| GET | /v1/listings/{id}/ | Listing detail |
| GET | /v1/businesses/{slug}/ | Business profile (published contact fields only) |
| POST | /v1/auth/register/ | `{name,email,password}` |
| POST | /v1/auth/login/ | `{email,password}` → `{access,refresh}` |
| POST | /v1/auth/password-reset/ | `{email}` |
| POST | /v1/auth/password-reset/confirm/ | `{token,password}` |

Entity shapes: `src/lib/api/types.ts`.

## Extension points (website)
- `src/lib/api/services.ts` — add one service per feature (favorites, reviews, notifications, assistant, moderation).
- `src/routes/dashboard.tsx` — add `beforeLoad` auth guard once auth exists.
- `src/routes/admin.tsx` — admin tools behind backend role checks.
- `src/routes/assistant.tsx` — connect to a backend assistant endpoint (DEC-008, DEC-011).
- Localization: language switch in footer is marked Planned.
