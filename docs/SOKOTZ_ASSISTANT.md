# SokoTZ Assistant — Product Reference

> **Status: PLANNED — documentation only.** SokoTZ Assistant is not recorded as implemented or tested anywhere in this documentation set. Track real progress in [ROADMAP.md](ROADMAP.md) and see [Section 2](#2-status-vocabulary-and-current-status) for the status vocabulary used in all documents.

## 1. Purpose
SokoTZ Assistant is an intelligent, conversational assistant integrated into the SokoTZ platform. It helps customers discover businesses, products and services, helps business owners use platform features and draft listing text, and guides users through common activities.

It is a supporting platform feature, not a separate marketplace and not a replacement for the marketplace's own search, browsing, listing or contact features. SokoTZ must remain fully usable when the assistant is unavailable.

## 2. Status Vocabulary and Current Status
All SokoTZ documents use the same four labels when describing assistant functionality:

| Label | Meaning | Evidence required |
|---|---|---|
| **Planned** | Intended by the project owner and described in the documentation; no implementation exists. | A documented requirement or decision. |
| **Proposed** | A suggested approach or value that has not been approved. Written as **PROPOSED — NEEDS APPROVAL**. | An entry in [DECISIONS.md](DECISIONS.md) once decided. |
| **Implemented** | Code exists in the repository and runs. | A reference to the actual commit, pull request or files. |
| **Tested** | Implemented and verified by tests that were actually executed, with results recorded. | Recorded test results in the test reports (see [TEST_PLAN.md](TEST_PLAN.md)). |

**Current status:** every assistant capability in this documentation set is **Planned** or **Proposed**. No implementation or test evidence has been reviewed, and nothing in this set may be read as claiming otherwise. Mapping to the roadmap's own status words is given in [ROADMAP.md](ROADMAP.md).

## 3. Primary Goals
- Make SokoTZ easier to use.
- Help users find relevant businesses and listings.
- Help business owners create better listings and descriptions.
- Answer questions about using the platform.
- Reduce repetitive support requests.
- Support future languages and international expansion.

## 4. User Groups and Access
- Visitors and customers.
- Registered business owners (sellers).
- Administrators and support staff, within their authorized workflows.

| Capability | Visitor (not logged in) | Customer | Business Owner | Administrator / Moderator |
|---|---|---|---|---|
| Chat and platform FAQs | MVP — **PROPOSED — NEEDS APPROVAL** (stricter rate limits) | MVP | MVP | MVP (same as any user) |
| Marketplace search and listing links | MVP — **PROPOSED — NEEDS APPROVAL** | MVP | MVP | MVP |
| Drafting listing, business and promotional text | Not available (login required) | Not available; the assistant explains how to start business onboarding | MVP | Not available in MVP |
| Reading the user's own private business data (own listing status, statistics) | Not available | Not available | Later | Later |
| Administrative or moderation assistance | Not available | Not available | Not available | Later, requires separate approval |

The assistant never gives a user access to anything that user could not already access through the normal SokoTZ interface and API.

## 5. Capabilities

### 5.1 Customers and visitors
- Understand natural-language searches for products, services and businesses.
- Ask for results based on category, location and available listing information.
- Present relevant results as links to actual SokoTZ listings.
- Explain how to contact a business through its published contact options.
- Explain how to use marketplace features.

### 5.2 Business owners
- Explain how to create and manage business profiles.
- Help draft product descriptions, business introductions and promotional text (MVP).
- Explain listing statuses and available dashboard features in general terms, using approved platform help content (MVP).
- Report the status of the user's own listings (Later; requires authorized retrieval).
- Summarize business statistics only when verified data is available and the user is authorized to access it (Later).

Drafting rules:
- Drafts are built from details the business owner supplies in the conversation. The assistant must not add facts the owner did not supply (price, materials, certifications, delivery promises, opening hours, awards, comparisons with competitors). Missing details are shown as clearly marked placeholders or requested from the owner.
- Drafts are labelled as AI-generated suggestions. The assistant never saves, publishes or edits a listing; the owner copies the text and saves it through the normal listing workflow.
- **PROPOSED — NEEDS APPROVAL:** allowing the assistant to read an existing listing owned by the user (after an ownership check) in order to improve its description. Until approved, the owner pastes the text into the chat.

### 5.3 Platform help
- Explain registration, login, account recovery and listing workflows.
- Provide clear troubleshooting guidance.
- Direct unresolved or sensitive cases to authorized human support. In the MVP this means pointing the user to a published support contact, if one exists; no live handoff is built (see [Section 15](#15-later-enhancements)). The support channel itself is **PENDING** ([DECISIONS.md](DECISIONS.md)).
- Answers come from approved platform help content. The owner and storage of that content are **PENDING**. Where no approved answer exists, the assistant says so.

### 5.4 Administrators and support staff
No administrator-specific assistant features are planned for the MVP. Administrators use the assistant like any other user. Any later administrative feature requires its own approved requirements, role checks and audit logging.

## 6. Non-Goals (MVP)
- Replacing marketplace search, browsing, listing pages or contact buttons.
- Taking actions on behalf of users: publishing, editing or deleting listings, changing account settings, messaging businesses, ordering, purchasing or paying.
- Negotiating, booking or promising anything on behalf of a business.
- Personalized recommendations based on user history.
- Providing market prices, ratings, reviews, stock levels or statistics that the platform does not store.
- Giving legal, financial, medical or other professional advice.
- Handling file, image or voice uploads.
- Showing sponsored or paid placements. If this is ever approved, sponsored results must be clearly labelled and must not be mixed silently with organic results.

## 7. Truth and Data Grounding
- Do not invent businesses, products, prices, stock availability, reviews, ratings, locations or statistics.
- Use current platform data for marketplace search results.
- Clearly state when information is unavailable, outdated or cannot be verified.
- Distinguish AI-generated suggestions from verified business information.
- Link users to the relevant listing or platform page whenever possible.

Operational rules that make these statements enforceable:
- Every business or listing the assistant names must come from a record returned by an authorized backend retrieval operation during that same request. The backend rejects or removes references to anything else.
- Links to listings are built by the backend from record identifiers. URLs written by the AI model are never rendered as links.
- Only listings that the requesting user may see through the normal interface are eligible. In particular, unpublished, rejected, removed or moderation-suspended listings are excluded for ordinary users.
- Prices, contact details and locations are quoted only from the stored fields. The assistant does not estimate, convert or "round" them.
- If the platform does not store a data type (for example stock or reviews), the assistant says it cannot verify it and suggests contacting the business.
- When a request is ambiguous (for example an unclear location or category), the assistant asks one short clarifying question or states the interpretation it used. It does not guess silently.
- Text retrieved from the database (listing descriptions, business names) is untrusted data and is never treated as instructions ([SECURITY.md](SECURITY.md)).

## 8. Interaction Rules
- The assistant identifies itself as SokoTZ Assistant and as an AI system.
- It stays within SokoTZ topics (finding businesses and listings, using the platform, drafting listing text). For out-of-scope requests it says so briefly and redirects.
- It replies in the language of the user's message, Kiswahili or English, and uses Kiswahili when the language is unclear.
- It keeps answers concise and shows a small, bounded number of results per answer (the number is a configuration value to be set; **PROPOSED:** 5), with a way to view more through the standard search page.
- It never asks for passwords, one-time codes, API keys, payment details or other unnecessary sensitive information, and tells users not to share them.
- It does not claim to have performed an action it did not perform.

## 9. Permissions and Actions
- Apply the same authorization rules as the rest of SokoTZ.
- Never expose private account, business or administrative data to unauthorized users.
- Initially prioritize answering questions, searching listings and drafting text.
- Do not publish listings, change account settings, make purchases or initiate payments without an approved workflow and explicit user confirmation.
- Log sensitive administrative actions appropriately.

Additional rules:
- In the MVP the assistant is **read-only** with respect to marketplace data. No write operation is exposed to it.
- Assistant retrieval runs with the identity and permissions of the requesting user, never with a broader service identity.
- If a user asks for an action the assistant cannot perform, it explains this and points to the normal screen that performs the action.
- Any future consequential action requires: an approved requirement and decision, server-side authorization, a server-enforced confirmation step that shows exactly what will change, and an audit record. Confirmation expressed only in chat text, or inferred by the AI model, is not sufficient.

## 10. Language and Experience
- Support Kiswahili as the primary initial language.
- Support English where available.
- Use clear, respectful, concise language.
- Provide suggested questions and a way to start a new conversation.
- Work on mobile and desktop.
- Display loading, empty, failure and retry states.

Details are in [UI_UX_SPEC.md](UI_UX_SPEC.md). The quality of the assistant's Kiswahili is not assumed; it must be reviewed by Kiswahili speakers before release ([TEST_PLAN.md](TEST_PLAN.md)).

## 11. Technical Integration
- Integrate through the existing SokoTZ frontend and backend architecture.
- Keep AI provider credentials on the server, never in frontend source code.
- Use backend-controlled APIs for authorized listing searches and other approved tools.
- Do not bypass existing business rules, permissions or validation.
- Define conversation storage, retention and privacy before storing chat histories.
- Apply appropriate rate limits, error handling, monitoring and cost controls.
- Keep the AI provider replaceable where practical.

Intended request flow (see [ARCHITECTURE.md](ARCHITECTURE.md) for detail):
1. The user sends a message through the frontend.
2. The backend authenticates the user (if logged in), validates the request, applies rate limits and checks permissions.
3. If marketplace information is needed, the backend retrieves it from the real database through controlled, authorized search operations.
4. The AI model interprets the request and explains only the retrieved results or approved help content.
5. The backend checks the response against the retrieved data and builds the listing links.
6. The frontend displays the response and links to the actual listings.

The AI provider, model, hosting and pricing are **not decided** (see [DECISIONS.md](DECISIONS.md)). No endpoint, table or configuration variable for the assistant is defined yet; they must be defined in the project's API and database documentation before implementation.

## 12. Error Handling
| Situation | Expected behavior |
|---|---|
| Question the assistant cannot answer | States that it does not know or cannot verify; does not guess; suggests search, platform help or the support contact if one exists. |
| Search returns no results | States that no matching listings were found; suggests broadening category or location; does not invent alternatives. |
| Ambiguous request | Asks one short clarifying question or states the interpretation used. |
| Message empty, too long or malformed | Rejected by the backend with a clear, translated message; the user's text is kept in the input where practical. |
| Rate limit or usage cap reached | Explains that the limit was reached and when to retry, without exposing internal limits. |
| Feature needs login or a role the user lacks | Explains what is required and links to login or onboarding. |
| AI provider timeout or error | Shows a friendly failure message with a retry action; no raw error text; suggests the standard search; the rest of the marketplace keeps working. |
| AI output malformed, or references a listing not retrieved | The backend discards the unsupported part, or returns a safe fallback message; the event is logged without private content. |
| Backend search or database failure | Same as provider failure; the assistant must not answer marketplace questions from the model's memory. |
| Assistant disabled by an operator | The entry point is hidden or shows that the assistant is temporarily unavailable. |
| Request for a consequential action | Declines and points to the normal screen (see [Section 9](#9-permissions-and-actions)). |
| Harmful, abusive or policy-violating request | Declines briefly; does not provide the content. |
| Prompt-injection attempt (in user text or retrieved data) | Instructions are ignored; the assistant continues within its rules; the event may be logged as metadata ([SECURITY.md](SECURITY.md)). |

## 13. Privacy and Security
- Do not request passwords, secret keys or unnecessary sensitive information.
- Restrict access to private records by authenticated user and permissions.
- Do not use another business owner's private analytics in responses.
- Define retention, deletion and disclosure rules for conversations.
- Protect against prompt injection, malicious inputs, data leakage and abusive usage.

Additional principles:
- Send the AI provider only what the request needs: the user's message, a limited amount of recent conversation, and the public fields of retrieved records. Never send passwords, tokens, session data or other users' private data.
- Conversation content is **not stored** in the MVP unless a storage policy is approved first (**PROPOSED — NEEDS APPROVAL**; see [DATABASE_DESIGN.md](DATABASE_DESIGN.md)).
- Users are told that they are talking to an AI system and how their chat data is handled before or at first use.
- Whether the AI provider's data handling meets the applicable data-protection requirements, including Tanzanian law, must be reviewed by qualified legal counsel before launch. This document is not legal advice.

The full requirements are in [SECURITY.md](SECURITY.md).

## 14. MVP Scope
In priority order:
1. Chat interface integrated into SokoTZ.
2. Platform help and frequently asked questions.
3. Search grounded in actual marketplace listings.
4. Helpful links to matching businesses and products.
5. Product description and promotional text drafting for business owners.
6. Clear handling of unknown questions, empty results, timeouts and AI service failures, with privacy protections.

Everything not listed here is outside the MVP unless an approved decision says otherwise.

## 15. Later Enhancements
These are future work and have no approved requirements ([SRS.md](SRS.md) FR-010 rule applies):
- Personalized recommendations with appropriate consent.
- Business analytics explanations (verified data, authorized users only).
- Reporting the status of a user's own listings.
- Multilingual expansion.
- Approved actions through secure, permission-checked tools with explicit confirmation.
- Human support handoff.
- Administrator or moderator assistance.
- Additional AI providers and advanced workflows.
- Image or file input (requires separate security approval).

## 16. International Expansion
SokoTZ is Tanzania-first (DEC-001). The assistant is designed so that country, language, currency and location rules can be added later: assistant text, help content and supported-language lists must not be hard-coded in a way that prevents this, and country-specific behavior must be an explicit design choice. No non-Tanzanian behavior is planned for the MVP.

## 17. Open Decisions
Unresolved choices are tracked in [DECISIONS.md](DECISIONS.md): AI provider and model, conversation storage and retention, visitor access, how natural-language requests are turned into searches, source and owner of help content, support channel, rate-limit and cost values, response streaming, entry points, Kiswahili quality criteria, privacy review and disclosure text, and the assistant kill switch. Nothing in those areas should be treated as approved.

## 18. Testing and Acceptance
Requirements with acceptance criteria are in [SRS.md](SRS.md) (FR-011 to FR-027, NFR-001 to NFR-010). Test scenarios are in [TEST_PLAN.md](TEST_PLAN.md). In summary:
- Listing results correspond to actual database records.
- Unauthorized users cannot retrieve private information.
- Unknown questions and backend or AI outages are handled gracefully.
- Kiswahili and English interactions work as supported.
- The chat is usable on mobile and by keyboard.
- Protected actions cannot be triggered without authorization and confirmation.

## 19. Related Documents
[PROJECT_BRIEF.md](PROJECT_BRIEF.md), [SRS.md](SRS.md), [USER_FLOWS.md](USER_FLOWS.md), [UI_UX_SPEC.md](UI_UX_SPEC.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DATABASE_DESIGN.md](DATABASE_DESIGN.md), [SECURITY.md](SECURITY.md), [TEST_PLAN.md](TEST_PLAN.md), [ROADMAP.md](ROADMAP.md), [DECISIONS.md](DECISIONS.md), [AGENTS.md](AGENTS.md), [README.md](README.md).

This document must remain consistent with all of them. Other documents summarize the parts relevant to their purpose and link here rather than copying this specification.

## 20. Implementation Status
The existence of this reference document does not mean the chatbot is implemented. Track actual implementation and test results in [ROADMAP.md](ROADMAP.md).
