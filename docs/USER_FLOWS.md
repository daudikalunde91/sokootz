# SokoTZ — User Flows

## 1. Visitor Discovery
Open homepage → enter search or choose category → view results → apply location/category filters → open business details → contact business.

## 2. Customer Account
Open registration → enter required details → validate input → create account → show confirmation → log in → access permitted account features.

## 3. Business Onboarding
Register or log in → open business dashboard → create business profile → add contact details and location → save → submit for review if moderation is required → receive status feedback.

## 4. Listing Management
Open owned business → create product/service → enter title, description, category and price where applicable → upload valid images if supported → save → preview → publish or submit for review according to platform rules.

## 5. Search and Contact
Enter search term → view matching results → filter by category/location → open listing → choose available phone or WhatsApp contact action.

## 6. Administration
Administrator logs in → opens administration area → reviews users, listings or reports → takes an authorized action → records outcome → confirms updated status.

## 7. Error and Recovery Flows
Document behavior for invalid fields, duplicate registration, incorrect passwords, expired reset links, missing listings, failed uploads, unavailable APIs and insufficient permissions.

## 8. Flow Rules
- Every protected action requires appropriate authorization.
- Business owners can manage only resources they are authorized to manage.
- The UI must provide loading, empty, success and error states.
- Only implement flows approved in SRS.md.
- SokoTZ Assistant flows (Section 9) never replace the standard flows above; every assistant result links back to normal marketplace pages, and the marketplace works without the assistant.

## 9. SokoTZ Assistant Flows (Planned)
Status: Planned; none of these flows is implemented or tested. Requirements are FR-011 to FR-027 in [SRS.md](SRS.md); interface behavior is in [UI_UX_SPEC.md](UI_UX_SPEC.md); the detailed reference is [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md).

### 9.1 Customer finds a business or product
Open the assistant (or choose a suggested question) → type a request in Kiswahili or English, for example a product or service in a location → backend validates the request and applies rate limits → backend searches real marketplace data → assistant explains the results in the user's language → result cards with links to the actual listings are shown.
Related requirements: FR-011, FR-012, FR-013, FR-014, FR-024.

### 9.2 Customer opens a result and contacts the business
From 9.1, select a result link → listing or business page opens in SokoTZ → choose an available phone or WhatsApp contact action as in the standard Search and Contact flow (Section 5). The assistant may explain which contact options are published; it does not contact the business on the user's behalf.
Related requirements: FR-014, FR-015, FR-007.

### 9.3 Seller improves a listing description
Log in as Business Owner → open the assistant (for example from the business dashboard or listing form) → provide the product or service details, or paste the existing description → assistant returns a draft marked as AI-generated, with placeholders or questions for missing details → seller edits the draft and copies it into the listing form → seller saves, previews and publishes or submits for review through the standard Listing Management flow (Section 4).
Alternatives: a visitor or Customer asks for drafting → the assistant explains that a Business Owner account is required and links to login or onboarding. The assistant never saves or publishes a listing.
Related requirements: FR-017, FR-018, FR-025.

### 9.4 User asks something the assistant cannot answer
User asks a question that is out of scope or not covered by approved help content → assistant says it cannot answer or verify it, without guessing → suggests a next step (platform search, help topics, or the support contact if one is defined) → user continues or starts a new conversation.
Related requirements: FR-016, FR-019, FR-021.

### 9.5 Search returns no results or the request is unclear
User asks for something with no matching listing → assistant says no matching listings were found → suggests broadening the category or location or opening the standard search → shows related real listings only if the backend returned them, labelled as related. For an unclear location or category, the assistant asks one short clarifying question first.
Related requirements: FR-020.

### 9.6 AI service outage, timeout or limit reached
User sends a message → the AI provider times out, fails, returns unusable output, or the backend search fails → the interface shows a friendly failure message with a retry action and a link to the standard search → user retries or leaves the chat; the rest of the site keeps working. If a usage limit is reached, the message explains this and when to try again. If an operator has disabled the assistant, the entry point is unavailable.
Related requirements: FR-022, FR-024, FR-027, NFR-004.

### 9.7 User requests an action that needs authorization or confirmation
User asks the assistant to perform a consequential action (publish a listing, change account settings, buy, pay, delete) → in the MVP the assistant declines, explains that it cannot do this, and points to the normal screen (a login prompt first if the user is not authenticated) → the user performs the action there, where standard authorization and confirmation dialogs apply.
Related requirements: FR-018, FR-023, FR-025.

### 9.8 User asks for private or unauthorized information
User asks for another person's private data, administrative information, or another business's private statistics → backend authorization denies the data → assistant explains that it cannot share this information and offers allowed alternatives. Instructions embedded in user text or listing content that try to change the assistant's rules are ignored.
Related requirements: FR-023; see [SECURITY.md](SECURITY.md).

## 10. Future Flows
Subscriptions, payments, multiple countries and advanced analytics must be documented and approved before development.
SokoTZ Assistant future flows (personalization, assistant-performed actions with a server-enforced confirmation step, human support handoff, administrator assistance, analytics explanations) must also be documented and approved before development; see [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md#15-later-enhancements).

## 11. Maintenance
Update this document whenever a user journey or requirement changes.
