# frontend/ — Folder Reference

Purpose:
Contains the client-facing application and reusable interface components.

Responsibilities:
- Pages and navigation.
- Forms and client-side validation.
- Responsive layouts and accessible components.
- API communication and display of server responses.
- Loading, empty, success and error states.
- When SokoTZ Assistant is built: chat interface, result cards and draft blocks rendered from backend data, with loading, empty, error, retry and accessibility states. The frontend never calls an AI provider and holds no AI credentials. See UI_UX_SPEC.md Section 10.

Reference documents:
- docs/UI_UX_SPEC.md
- docs/USER_FLOWS.md
- docs/SRS.md
- docs/ARCHITECTURE.md
- docs/SOKOTZ_ASSISTANT.md
- AGENTS.md

Rules:
Inspect the existing repository before creating files or selecting a framework. Do not duplicate an existing frontend or introduce a different stack without approval. Client-side checks do not replace backend security. Never claim data is saved unless the backend confirms it.

Folder contents and exact structure must follow the actual framework and approved architecture.
