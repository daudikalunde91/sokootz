# backend/ — Folder Reference

Purpose:
Contains server-side business logic, API endpoints, authentication, authorization, validation and persistence.

Responsibilities:
- Authenticate users and enforce roles.
- Enforce ownership of business profiles and listings.
- Validate requests and apply business rules.
- Read and write persistent data.
- Expose documented APIs.
- Handle errors safely and record appropriate operational events.
- When SokoTZ Assistant is built: host the assistant layer (request validation, rate limits, controlled read-only retrieval under the user's permissions, AI provider adapter, output validation, backend-built listing links). Keep AI credentials in backend configuration. See ARCHITECTURE.md Section 12.

Reference documents:
- docs/ARCHITECTURE.md
- docs/DATABASE_DESIGN.md
- docs/SECURITY.md
- docs/SOKOTZ_ASSISTANT.md
- docs/SRS.md
- docs/TEST_PLAN.md
- AGENTS.md

Rules:
Inspect existing framework, models and migrations first. Do not replace the current backend stack without approval. Never store plaintext passwords or hardcode secrets. Apply schema changes through migrations. Test permissions and data integrity.

Exact files and subfolders must match the verified backend framework and project structure.
