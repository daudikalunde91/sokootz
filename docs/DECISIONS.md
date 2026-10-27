# SokoTZ — Decision Log

## Purpose
Record important product, architecture, security and delivery decisions so that future work remains consistent.

## Decision Status
- Proposed
- Accepted
- Rejected
- Superseded

## Decision Record Template
### DEC-NNN — [Decision title]
- Date:
- Status:
- Context:
- Options considered:
- Decision:
- Rationale:
- Consequences:
- Related requirements:
- Supersedes / superseded by:

## Initial Direction
### DEC-001 — Tanzania-first, international-ready
- Status: Accepted as product direction.
- Decision: Launch in Tanzania and design for future international expansion.
- Consequence: Country-specific assumptions must be explicit and future expansion should be deliberate.

### DEC-002 — MVP-first delivery
- Status: Accepted as delivery principle.
- Decision: Implement and test core customer and business workflows before optional advanced features.
- Consequence: Features such as payments and advanced monetization require explicit scope approval.

### DEC-003 — Technology stack
- Status: Proposed until confirmed.
- Candidate: React/Vite, Django REST Framework and PostgreSQL.
- Decision: Verify the existing repository and obtain approval before treating this as the final stack.

## SokoTZ Assistant Decisions
Recorded in the 2026-10-18 documentation update for [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md). DEC-004 to DEC-007 restate direction given by the project owner for this work; DEC-008 onward are not decided; items marked "decision pending" use the Proposed status of the convention above until an option is chosen. No AI provider, pricing model, storage policy or technology for the assistant has been approved.

### DEC-004 — SokoTZ Assistant is a supporting marketplace feature
- Date: 2026-10-18
- Status: Accepted as product direction.
- Decision: SokoTZ Assistant is an AI chat feature inside the marketplace. It supports the marketplace and does not replace it. SokoTZ must work fully without it.
- Consequence: Core marketplace stages take priority; assistant stages A1 to A5 in [ROADMAP.md](ROADMAP.md) depend on them.
- Related requirements: FR-011 to FR-027; extends DEC-002.

### DEC-005 — Real data only, retrieved through controlled backend operations
- Date: 2026-10-18
- Status: Accepted as a product rule.
- Decision: The assistant never invents businesses, prices, availability, ratings, reviews, locations or statistics. Marketplace information comes from the real database through controlled, authorized backend operations, and the assistant states when information is unavailable or unverifiable.
- Consequence: Backend validation of every reference and backend-built links (FR-013, FR-014, FR-021, NFR-001).

### DEC-006 — Assistant MVP scope
- Date: 2026-10-18
- Status: Accepted as a delivery principle.
- Decision: MVP priorities are the chat interface, platform FAQs, search grounded in real marketplace data, links to actual listings, seller listing-description assistance, and clear error handling and privacy protection. Advanced autonomous actions, payments, personalization and other complex features are future work.
- Consequence: Later items need separately approved requirements (see FR-010 and DEC-002).

### DEC-007 — Assistant security principles
- Date: 2026-10-18
- Status: Accepted as a security rule.
- Decision: AI provider credentials stay on the backend. The assistant must not bypass existing application permissions. Consequential actions require authorization and explicit confirmation.
- Consequence: See [SECURITY.md](SECURITY.md) Section 11 and FR-023, FR-025.

### DEC-008 — AI provider and model
- Status: Proposed — decision pending; no option chosen. No provider has been selected or evaluated.
- Decision needed: provider, model, hosting and pricing model.
- Factors to evaluate: Kiswahili and English quality, data handling and retention terms, cost, reliability, data-processing location, and ease of replacement (NFR-008).

### DEC-009 — Conversation storage and retention
- Status: Proposed — needs approval.
- Proposal: store no conversation content in the MVP; keep only metadata. Any storage needs an approved retention, deletion and disclosure policy first (see [DATABASE_DESIGN.md](DATABASE_DESIGN.md) Section 8).

### DEC-010 — Assistant access for visitors who are not logged in
- Status: Proposed — needs approval.
- Proposal: allow chat, FAQ and search for visitors with stricter rate limits; require login for seller drafting.

### DEC-011 — How natural-language requests become searches
- Status: Proposed — needs approval.
- Proposal: the AI model only suggests structured search parameters; the backend validates them and runs the existing search; the model has no direct database access ([ARCHITECTURE.md](ARCHITECTURE.md) Section 12).

### DEC-012 — Source and owner of platform help content
- Status: Proposed — decision pending; no option chosen. Decide where approved FAQ and help content is stored, who maintains it, and how changes are reviewed.

### DEC-013 — Limits, timeouts and cost caps
- Status: Proposed — decision pending; no option chosen. Set rate limits, message and output length limits, provider timeout, retry policy and spending cap (FR-024, NFR-003, NFR-009).

### DEC-014 — Entry points and response delivery
- Status: Proposed — needs approval.
- Proposal: entry points as listed in [UI_UX_SPEC.md](UI_UX_SPEC.md) Section 10.1; non-streaming responses in the MVP so the backend can validate complete output.

### DEC-015 — Assistant kill switch
- Status: Proposed — needs approval (FR-027). Decide the mechanism and who may use it.

### DEC-016 — Assistant reading the seller's existing listing
- Status: Proposed — needs approval. Without approval the seller pastes text into the chat.

### DEC-017 — Human support channel
- Status: Proposed — decision pending; no option chosen. Decide whether a published support contact exists for unresolved cases. Live handoff is not part of the MVP.

### DEC-018 — Privacy disclosure and legal review
- Status: Proposed — decision pending; no option chosen. Approve the user-facing AI and privacy notice (FR-026) and complete a review of the provider's data handling and applicable Tanzanian data-protection requirements with qualified counsel.

### DEC-019 — Documentation location
- Status: Proposed — decision pending; no option chosen. The documentation set was delivered as a single folder, while several documents refer to a docs/ folder. Decide whether to keep a flat layout or place reference documents in docs/, then update links.

## DEC-020 Shared backend: Android Firebase project — Accepted (2026-10-23)
The owner's integration brief directs the website to use the Android app's Firebase Auth and named Firestore database instead of the proposed Django/PostgreSQL API. Accepted and implemented. Django/PostgreSQL proposals (and DEC-003's stack question for the backend) are superseded. Privileged admin actions will need a trusted server with the Firebase Admin SDK (pending).

## Change Policy
Do not silently overwrite important decisions. Add a new record and mark the previous decision as superseded when necessary.

## Open Questions
Record unresolved decisions, their impact and the person or stage responsible for resolving them.

### Current open questions (SokoTZ Assistant)
| Question | Impact | Responsible |
|---|---|---|
| DEC-008 AI provider and model | Blocks Stage A2; affects cost, privacy and Kiswahili quality | Project owner, Stage A1 |
| DEC-009 Conversation storage and retention | Affects database design, privacy and legal review | Project owner, Stage A1 |
| DEC-010 Visitor access | Affects abuse risk and cost | Project owner, Stage A1 |
| DEC-011 Natural language to search approach | Shapes backend design and tests | Stage A1 |
| DEC-012 Help content source and owner | Blocks FAQ answers | Project owner, Stage A1 |
| DEC-013 Limits, timeouts, cost caps | Needed to finalize FR-024 and NFR tests | Stage A1 |
| DEC-014 to DEC-016 Entry points, streaming, kill switch, seller listing read | Affect UI and architecture | Stage A1 |
| DEC-017 and DEC-018 Support channel, privacy and legal review | Required before launch | Project owner |
| DEC-019 Documentation location | Link correctness | Project owner |
| DEC-003 Technology stack confirmation | Assistant must follow the confirmed stack | Project owner |

### DEC-018 — Website frontend stack
- Date: 2026-10-18
- Status: Accepted for the website.
- Decision: The website uses React 19 on TanStack Start (Vite), Tailwind v4. Backend remains the proposed Django REST API (DEC-003), reached only through `src/lib/api`.
- Consequence: Until the API exists, data pages show empty states and forms report that accounts are not open yet. Contracts: API_CONTRACTS.md.
