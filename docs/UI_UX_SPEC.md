# SokoTZ — UI/UX Specification

## 1. Design Goals
Create a clear, trustworthy, responsive marketplace experience. Prioritize usability, readability, accessibility and performance over unnecessary decoration.

## 2. Brand
Product name: SokoTZ.
Initial market: Tanzania.
Primary language: Kiswahili.
Additional language: English.
The design must not prevent future internationalization.

## 3. Design Consistency
Use centralized design tokens for colors, typography, spacing, borders, shadows and responsive breakpoints. Reuse components rather than inventing new styles on every page.

## 4. Core Pages
- Public homepage and search.
- Search results and filters.
- Business profile/details.
- Product or service details.
- Registration, login and password recovery.
- Customer account area where required.
- Business dashboard and listing management.
- Administration and moderation area.
- SokoTZ Assistant chat interface (planned; see Section 10).

## 5. Shared Components
Header, navigation, footer, search bar, category navigation, listing card, business card, form field, button, status indicator, pagination and confirmation dialog.

SokoTZ Assistant reuses the shared listing card, business card, button, form field, status indicator and confirmation dialog. Only chat-specific components are new: chat panel, message bubble, suggested-question chip, typing indicator and draft-text block.

## 6. Interface States
Every data-dependent page must consider loading, success, empty results, validation errors, server errors and access denied states.

## 7. Responsive Design
Support mobile, tablet and desktop layouts. Test navigation, forms, listing cards, images and filters at different viewport sizes.

## 8. Accessibility
Use readable contrast, keyboard-accessible controls, visible focus indicators, meaningful labels and alternative text for informative images.

## 9. Content
Use concise, understandable Kiswahili by default. Avoid misleading claims, fake reviews and fabricated listing information.

The same rule applies to SokoTZ Assistant: its text and cards must never present fabricated listings, ratings or reviews.

## 10. SokoTZ Assistant Interface (Planned)
Status: Planned; nothing here is implemented or tested. Values marked PROPOSED need approval. Requirements: FR-011 to FR-027 and NFR-003 to NFR-007 in [SRS.md](SRS.md). Behavior reference: [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md). The chat uses the existing SokoTZ brand, design tokens and components; it must not introduce an unrelated visual identity.

### 10.1 Entry points (PROPOSED — NEEDS APPROVAL)
- An assistant button available on public pages.
- An "ask the assistant" link beside the search bar on the homepage and on the no-results state of search.
- A "help me write" action in the business dashboard and listing form for Business Owners.
Opening the chat never navigates away from the current page or loses form data.

### 10.2 Layout
- Mobile: full-screen chat view with a header (title "SokoTZ Assistant", new-conversation action, close), a scrolling message list and an input area that stays visible above the on-screen keyboard.
- Tablet and desktop: a docked panel or floating window that does not hide the page's primary content more than necessary (exact form PROPOSED).
- Usable from 320 CSS pixels wide upward; no horizontal scrolling of the conversation.

### 10.3 Messages and content
- Message bubbles distinguish the user's messages from the assistant's using design tokens and not by color alone. Assistant messages carry a visible label identifying them as AI-generated.
- Listing results appear as result cards that reuse the listing card or business card. Cards and their links are produced from backend data, not from text written by the AI model.
- Draft text for sellers appears in a distinct draft block labelled as an AI-generated suggestion, with a copy action. Placeholders for missing details are visibly marked. The block does not save anything.
- Assistant text is shown as plain text or a restricted, sanitized subset of formatting. Raw HTML from the model is never rendered.
- Suggested questions appear in the empty state, in the current interface language (3 to 4 suggestions, PROPOSED). Example Kiswahili wording below is draft copy and must be reviewed by a Kiswahili speaker before use:
  - "Nipate mafundi umeme karibu na Dar es Salaam"
  - "Nawezaje kusajili biashara yangu?"
- Example English suggestion: "How do I add a product to my business?"
- A visible new-conversation action clears the chat.
- A short notice states that SokoTZ Assistant is an AI system that can make mistakes, and links to information on how chat data is handled (see FR-026). Text is subject to approval.

### 10.4 Interface states
| State | Behavior |
|---|---|
| Empty (first open) | Greeting, AI notice, suggested questions. |
| Sending / waiting | Message appears immediately; a typing or loading indicator is shown; sending is disabled for the pending message. |
| Success | Assistant text plus result cards or draft block. |
| No results | Plain statement that nothing matched, with a link to the standard search and suggestions to broaden the query. |
| Unknown question | Plain statement that the assistant cannot answer or verify it, with next steps. |
| Validation error | Empty or over-length input is explained; the typed text is kept. |
| Rate limited | Message explaining that the limit was reached and when to try again. |
| Login or role required | Explanation with a link to login or onboarding. |
| Service failure or timeout | Friendly message with a Retry action and a link to the standard search. No technical details. |
| Network offline | Message that the connection is unavailable; the unsent text is kept. |
| Assistant disabled | Entry points hidden or marked temporarily unavailable. |

### 10.5 Language
The interface language follows the SokoTZ language setting (Kiswahili by default). The assistant replies in the language of the user's message. Message content is marked with the correct language attribute so screen readers pronounce it properly.

### 10.6 Accessibility
PROPOSED target: WCAG 2.2 level AA; conformance is not claimed until tested.
- Full keyboard operation: Enter sends and Shift+Enter inserts a new line; a visible Send button is also provided. Escape closes the chat.
- On open, focus moves into the chat (the input or the dialog); on close, focus returns to the control that opened it. If the chat is modal, focus is kept inside it.
- The message list is a live region (polite) so new assistant messages are announced; loading and error states are announced as status messages; the view does not scroll away from older messages the user is reading.
- Visible focus indicators, readable contrast, meaningful labels for every control and descriptive link text (the listing name, not "click here").
- Touch targets of at least 44 by 44 CSS pixels (PROPOSED), text that scales to 200% without loss of function, and reduced motion respected for typing and opening animations.
- Errors and states are never indicated by color alone.

## 11. Implementation Rule
Inspect the existing interface and approved designs before changing styles. Document approved design changes and preserve consistency across all pages.
