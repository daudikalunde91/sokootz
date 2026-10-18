# SokoTZ — Database Design

## 1. Principles
Use a consistent, normalized schema with clear ownership, constraints, relationships and migration history. Inspect existing models before proposing changes.

## 2. Candidate Entities
- User: identity, authentication reference, status and timestamps.
- BusinessProfile: owner, business name, description, category, location and contact information.
- Category: classification of businesses and listings.
- Listing: title, description, type, owner/business, status and timestamps.
- ListingImage: image reference, metadata and associated listing.
- Location: country and supported administrative divisions.
- Report: reporter, reported resource, reason, status and resolution.
- SubscriptionPlan and Subscription: proposed entities if paid plans are approved.
- SponsoredCampaign: proposed entity if sponsored promotion is approved.
- AuditEvent: security or administrative event metadata where appropriate.

## 3. Relationship Expectations
A user may own a business profile according to approved rules. A business may have multiple listings. Categories classify businesses or listings. Images belong to authorized resources. Reports reference a reported resource and track moderation.

## 4. Data Integrity
Define primary keys, foreign keys, uniqueness, required fields, validation, indexes and deletion behavior. Enforce ownership and important constraints in the backend as well.

## 5. Privacy and Security
Never store plaintext passwords. Avoid storing unnecessary personal data. Protect contact information and administrative records according to approved privacy requirements.

## 6. Future Country Support
Define how countries, regions, currencies and languages will be represented. Do not assume every country has the same address structure.

## 7. Migrations
Schema changes must use the project's migration system. Never make untracked production schema changes.

## 8. SokoTZ Assistant Data Considerations (Proposed)
Status: Proposed; **no assistant table or column exists or is approved.** This section evaluates whether [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md) needs new data and records the safest minimal position. Entities are added only when a recorded decision approves the feature that needs them.

### 8.1 MVP position (PROPOSED — NEEDS APPROVAL)
- The MVP needs no new tables. Search, help and drafting read existing candidate entities (BusinessProfile, Listing, Category, Location, ListingImage) through the same visibility rules as the standard search.
- Conversation content is not persisted. The context of an active chat is bounded and short-lived. How it is held (sent by the client and treated as untrusted input, or kept in short-lived server-side state) is open.
- Operational usage data (request counts, outcomes, error categories, token or cost counters) contains no message content. Rate-limit counters should live in the infrastructure used for rate limiting and need no new table. Security-relevant events (for example repeated rate-limit hits, blocked injection attempts) can use the existing candidate AuditEvent with metadata only.

### 8.2 Existing data the assistant depends on
- Listing status and moderation state must be reliable, because only listings visible to the requesting user may be returned (FR-013).
- Category and Location need names that match how people search in Kiswahili and English. Whether this needs synonym or translated names is an open design question for Category and Location; it is not an assistant-only table.
- Contact fields shown by the assistant are the same published fields shown by the normal interface (FR-015).

### 8.3 Candidate entities, only if approved
| Candidate | Needed only if | Notes |
|---|---|---|
| AssistantConversation | Chat history is approved | Owner (a registered user), created and updated times, language, status. One owner per conversation; not shared. |
| AssistantMessage | Chat history is approved | Conversation, role (user or assistant), content, timestamp, identifiers of listings referenced. |
| AssistantFeedback | Feedback collection is approved | Reference to a message, rating, optional comment. |

Not proposed: embeddings or a vector index of listing content. If semantic search is ever wanted, it needs a separate decision covering cost, privacy and what listing text is sent to a provider.

### 8.4 Privacy, ownership, retention and deletion (apply if any conversation data is stored)
- Conversation records belong to one user and are readable only by that user, plus any support access that is separately approved and audited. Visitors' conversations are never stored against an identity.
- Chat text can contain personal data such as names, phone numbers and locations, and users may paste sensitive information by mistake. Store the minimum; define a retention period (PENDING) and delete automatically when it expires.
- Users must be able to delete their conversations, and account deletion must define what happens to them, including backups.
- Passwords, tokens and AI provider credentials are never stored in conversation data.
- Whether stored content may be used to improve the assistant or evaluate quality is not assumed; it requires an explicit decision and disclosure.
- The legal basis and disclosure requirements are to be reviewed by qualified counsel before launch.

### 8.5 Migrations
Any approved assistant table must be created through the project's migration system with ownership constraints, indexes and deletion behavior defined in this document first.

## 9. Status
These are candidate entities, not confirmation that database tables already exist. Finalize the schema against SRS.md and the actual repository before implementation.
Assistant-related items in Section 8 are Proposed and not approved.
