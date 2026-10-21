# SokoTZ — Development Roadmap

## Status Definitions
- Not started: work has not begun.
- In progress: work is actively being implemented.
- Blocked: a dependency or issue prevents progress.
- Verified complete: acceptance criteria and required checks have passed.

## Stage 1 — Project Foundation
Repository structure, documentation, environment setup, configuration and baseline checks.

## Stage 2 — Authentication
Registration, login, logout, password recovery, validation and role permissions.
Status: **Blocked** — on 2026-10-21 the owner confirmed waiting for the separate Django API instead of enabling Lovable Cloud. User profiles are required. Email account forms and Continue with Google remain Coming soon; no account creation, sign-in or recovery is currently available.

## Stage 3 — Business Profiles
Business onboarding, profile editing, contact information and location.

## Stage 4 — Listings
Product/service creation, editing, image handling, validation and moderation status.

## Stage 5 — Discovery
Homepage, categories, search, location filters, listing details and contact actions.

## Stage 6 — Administration
User management, listing review, reports, moderation and auditability.

## Stage 7 — Quality and Analytics
Critical test coverage, usability improvements, basic usage analytics and performance checks.

## Stage 8 — Monetization
Validate pricing and implement subscriptions or sponsored listings only after requirements and payment decisions are approved.

## Stage 9 — Launch
Deployment, HTTPS, database migrations, backups, monitoring, support process and launch checks.

## Stage 10 — Expansion
Localization, country-specific locations, currencies and policies when expansion is approved.

## SokoTZ Assistant Track
SokoTZ Assistant is a supporting feature (see [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md)). Its stages are labelled A1 to A5 so they are not confused with Stages 1 to 10, and they must not delay the core marketplace stages they depend on.

Status mapping: the roadmap statuses above are used. In the vocabulary of [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md#2-status-vocabulary-and-current-status), Planned or Proposed work is "Not started"; Implemented work that is not yet verified is "In progress"; Tested work with recorded passing results is "Verified complete". Documentation alone never counts as Implemented or Tested.

### Stage A1 — Assistant Requirements, Architecture and Interface Planning
- Scope: assistant documentation, resolving or explicitly deferring the open decisions in [DECISIONS.md](DECISIONS.md) (AI provider, conversation storage and retention, visitor access, help content owner, entry points, limits), and defining the assistant's API and configuration documentation.
- Dependencies: Stage 1; confirmation of the technology stack (DEC-003).
- Deliverables: approved decisions, consistent documents, API and configuration definitions, approved chat interface design.
- Acceptance criteria: all decisions needed for A2 are recorded as Accepted or explicitly deferred; documents are consistent; the project owner has reviewed them.
- Tests: documentation consistency review.
- Blockers: provider selection; privacy and legal review.
- Status: **In progress** — documentation drafted in this update; approvals outstanding. Not complete.

### Stage A2 — Chat Interface and Platform FAQs
- Scope: chat interface, backend assistant layer with a replaceable provider adapter, approved help content, error handling, rate limits and usage caps, AI notice, assistant kill switch if approved.
- Dependencies: A1 decisions; Stage 1; Stage 2 (authentication and roles).
- Deliverables: working chat answering platform questions; failure and limit handling; assistant security controls for this scope.
- Acceptance criteria: FR-011, FR-012, FR-016, FR-019, FR-022, FR-024, FR-026 (and FR-027 if approved); NFR-002 to NFR-004, NFR-008 to NFR-010.
- Tests: TC-AST-001 to TC-AST-004, 009, 010, 014, 020 to 030, 037, 040, 043 to 050 as applicable.
- Blockers: A1 decisions; provider access and credentials.
- Status: Not started.

### Stage A3 — Real Marketplace Search Integration
- Scope: controlled, read-only retrieval of real listings under the user's permissions, result cards, backend-generated links, grounding validation, empty and ambiguous result handling.
- Dependencies: A2; Stage 4 (listings) and Stage 5 (discovery and search), including reliable listing visibility rules.
- Deliverables: grounded search through the assistant; links to actual listings; contact explanations.
- Acceptance criteria: FR-013, FR-014, FR-015, FR-020, FR-021, FR-023; NFR-001.
- Tests: TC-AST-005 to 008, 015 to 019, 031 to 036, 038, 041, 042.
- Blockers: Stage 5 search not available; undefined listing visibility rules.
- Status: Not started.

### Stage A4 — Seller Listing-Writing Assistance
- Scope: drafting of product or service descriptions, business introductions and promotional text for authenticated Business Owners. Reading the owner's existing listing is PROPOSED — NEEDS APPROVAL.
- Dependencies: A2; Stage 2 (roles), Stage 3 (business profiles), Stage 4 (listing management).
- Deliverables: seller drafting with role checks and AI-generated labelling; no saving or publishing by the assistant.
- Acceptance criteria: FR-017, FR-018, FR-025.
- Tests: TC-AST-011 to 013, 038.
- Blockers: Stages 3 and 4 not complete.
- Status: Not started.

### Stage A5 — Advanced Features (only if justified)
- Scope: personalization, analytics explanations, user actions with server-enforced confirmation, human support handoff, administrator assistance, additional providers.
- Dependencies: a working, tested MVP (A2 to A4), recorded user need, and separately approved requirements and decisions.
- Deliverables, acceptance criteria and tests: to be defined when approved.
- Status: Not started; no scope approved.

### Interaction with Existing Stages
- Stage 7 (Quality and Analytics) includes assistant accessibility, performance and security testing, and any assistant usage analytics (those measures are PROPOSED in [PROJECT_BRIEF.md](PROJECT_BRIEF.md)).
- Stage 8 (Monetization): sponsored or paid placement must not influence assistant results unless separately approved and clearly labelled.
- Stage 9 (Launch): the assistant release criteria in [TEST_PLAN.md](TEST_PLAN.md) apply, together with provider configuration, monitoring, cost alerts and the incident response additions in [SECURITY.md](SECURITY.md).
- Stage 10 (Expansion): assistant language and country support is extended deliberately.

## Stage Rules
Each stage must specify scope, dependencies, deliverables, acceptance criteria, tests, blockers and status. Do not mark a stage complete without evidence.

## Current Status
The real status must be established from repository inspection and test results. Do not assume any stage is complete from this template alone.

SokoTZ Assistant: documentation has been drafted (Stage A1 in progress). No implementation or test evidence has been reviewed; Stages A2 to A5 are not started.
