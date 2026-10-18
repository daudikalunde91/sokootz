# MASTER TASK: UPDATE ALL SokoTZ MARKDOWN DOCUMENTATION FOR AI ASSISTANT INTEGRATION

## 1. OBJECTIVE

Review and update all existing Markdown (`.md`) documentation in the SokoTZ project so that the planned **SokoTZ Assistant — an AI-powered chatbot integrated into the marketplace — is properly documented across the entire project**.

This is a documentation task first. Do not start implementing the chatbot or modifying application functionality unless explicitly required to correct a documentation-related inconsistency.

## 2. READ THE EXISTING DOCUMENTATION FIRST

Before making changes, inspect the actual project repository and read the existing documentation, especially:

- `AGENTS.md`
- `README.md`
- `docs/PROJECT_BRIEF.md`
- `docs/SRS.md`
- `docs/USER_FLOWS.md`
- `docs/UI_UX_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_DESIGN.md`
- `docs/SECURITY.md`
- `docs/TEST_PLAN.md`
- `docs/ROADMAP.md`
- `docs/DECISIONS.md`
- `docs/SOKOTZ_ASSISTANT.md`, if it already exists.

Discover any other relevant `.md` files in the repository and inspect them before deciding what needs to change.

**Important:** Use the actual contents of the files. Do not assume they match a template, and do not replace existing project-specific information with generic content.

## 3. UPDATE ALL RELEVANT DOCUMENTATION

Integrate the SokoTZ Assistant consistently into the existing documents.

### A. `PROJECT_BRIEF.md`
Document the assistant's purpose, target users, value to customers and sellers, MVP scope, limitations, and expected benefits. Keep the marketplace as the main product; the assistant is a supporting feature.

### B. `SRS.md`
Add clear, testable functional and non-functional requirements for the assistant, including:
- Opening and using the chat interface.
- Asking questions in Kiswahili and English.
- Searching actual businesses, products, and services.
- Displaying links to relevant marketplace listings.
- Answering platform-related FAQs.
- Helping sellers draft product descriptions and promotional text.
- Handling unsupported questions, empty results, and service failures.
- Applying authentication, authorization, validation, and rate limits where appropriate.

Give new requirements unique IDs consistent with the existing document.

### C. `USER_FLOWS.md`
Document user journeys for:
- A customer asking the assistant to find a business or product.
- A customer opening a result and contacting a business.
- A seller asking for help improving a listing description.
- A user asking a question the assistant cannot answer.
- A user encountering an AI service outage.
- A user requesting an action that requires authorization or confirmation.

### D. `UI_UX_SPEC.md`
Define the chat interface, entry points, responsive mobile and desktop layouts, message bubbles, suggested questions, loading indicators, errors, empty states, accessibility, keyboard navigation, and links to real listings.

Keep the design consistent with the existing SokoTZ brand and design system. Do not invent an unrelated visual identity.

### E. `ARCHITECTURE.md`
Document how the assistant integrates with the current architecture. Follow the project's actual stack and structure; do not silently replace or assume technologies.

Specify the intended flow:

1. User sends a message through the frontend.
2. The backend validates the request and checks permissions.
3. Where marketplace information is needed, the backend retrieves relevant data from the real database through authorized search/API operations.
4. The AI interprets the request and explains the retrieved results.
5. The frontend displays the response and links to the actual listings.

Keep AI provider credentials on the backend. Do not allow the AI model to bypass application authorization or access the database without controlled backend operations. Make the AI provider replaceable where practical.

### F. `DATABASE_DESIGN.md`
Evaluate whether the assistant needs persistent conversation history, message records, feedback, or usage metadata.

Document proposed entities and relationships only where justified. Clearly distinguish proposed schema changes from existing implemented tables. Define privacy, ownership, retention, deletion, and migration considerations.

Do not add database tables just because they might be useful in the future.

### G. `SECURITY.md`
Document assistant-specific security requirements, including:
- Prompt injection and malicious user input.
- Protection against private-data leakage.
- Authorization checks for account-specific or business-specific data.
- Server-side secret management.
- Rate limiting, abuse prevention, and usage-cost controls.
- Safe handling of uploaded files if uploads are later supported.
- Privacy disclosures and conversation retention/deletion.
- Confirmation and authorization before consequential actions.

Never expose passwords, API keys, session secrets, or another user's private information.

### H. `TEST_PLAN.md`
Add test scenarios for:
- Kiswahili and English questions.
- Correct results from actual marketplace data.
- No-result and unavailable-data cases.
- Incorrect or unsupported questions.
- Authentication and authorization boundaries.
- Prompt-injection and data-leakage attempts.
- Rate limits, timeouts, provider failures, and malformed responses.
- Listing links and responsive interface behavior.
- Any action requiring explicit confirmation.

Define release criteria that can be verified. Do not mark tests as passed unless they have actually been run.

### I. `ROADMAP.md`
Add SokoTZ Assistant as a staged feature with explicit dependencies and acceptance criteria. Use the roadmap's existing status conventions.

Use stages such as:
1. Assistant requirements, architecture, and interface planning.
2. Chat interface and platform FAQs.
3. Integration with real marketplace search.
4. Seller listing-writing assistance.
5. Advanced actions, personalization, or human support handoff, if justified.

Do not mark any stage complete merely because its documentation has been written. Distinguish planned, in-progress, implemented, and tested work.

### J. `DECISIONS.md`
Record important decisions and unresolved questions about the assistant. Mark each as accepted, proposed, or pending using the existing convention.

Do not falsely record a technology, AI provider, pricing model, conversation-storage policy, or other unresolved choice as approved.

### K. `AGENTS.md`
Add rules instructing future AI coding agents to:
- Read the relevant project documentation before making changes.
- Treat `SOKOTZ_ASSISTANT.md` as the assistant's detailed reference.
- Follow the existing architecture and project conventions.
- Use actual backend and database data rather than fabricated marketplace results.
- Never claim a feature is implemented or tested without evidence.
- Preserve existing functionality and avoid unrelated refactoring.
- Update documentation and tests when implementation changes.
- Protect user data, permissions, secrets, and production configuration.

### L. `README.md`
Add a concise description of SokoTZ Assistant, its intended capabilities, its planned/implemented status, links to relevant documentation, and any verified setup requirements. Do not advertise planned functionality as currently available.

### M. `SOKOTZ_ASSISTANT.md`
Create this file if it does not exist. If it exists, review and improve it rather than blindly replacing it.

Use it as the detailed, central reference for the assistant's purpose, supported capabilities, non-goals, interaction rules, data grounding, permissions, language support, architecture, privacy, security, error handling, MVP scope, future extensions, and acceptance criteria.

Other documents should summarize the parts relevant to their purpose and link to this detailed reference. Avoid copying the entire assistant specification into every file.

## 4. IMPORTANT PRODUCT RULES

The SokoTZ Assistant must follow these principles:

1. **Real data only:** Never invent businesses, products, services, prices, availability, ratings, reviews, locations, or statistics. Use verified marketplace data when available.
2. **Clear uncertainty:** If the system cannot verify information, say so.
3. **Marketplace first:** The assistant supports SokoTZ; it does not replace the marketplace.
4. **Permission-aware:** The assistant must follow the same authorization rules as the rest of the platform.
5. **No unauthorized actions:** Do not publish listings, change account settings, make purchases, process payments, or perform other consequential actions without a properly implemented workflow, authorization, and explicit user confirmation.
6. **Language:** Prioritize Kiswahili and support English. Keep the design and architecture ready for future languages.
7. **Privacy:** Do not reveal one user's private information to another user.
8. **No fake functionality:** Clearly distinguish documented plans from features that have been implemented and tested.
9. **MVP first:** Avoid unnecessary complexity. Keep advanced integrations and autonomous actions outside the initial MVP unless the existing project decisions explicitly require them.
10. **International expansion:** Preserve SokoTZ's Tanzania-first direction while allowing future country and language support where compatible with existing decisions.

## 5. CONSISTENCY AND QUALITY AUDIT

After editing the files:

- Check every internal Markdown link and correct broken links where possible.
- Ensure filenames and folder paths match the actual repository.
- Remove contradictions between the assistant specification, security rules, architecture, requirements, roadmap, and README.
- Preserve existing valid requirements, project decisions, and documentation.
- Avoid duplicated or contradictory requirements.
- Use consistent terminology: **SokoTZ Assistant**.
- Label assumptions, proposals, pending decisions, and implemented functionality accurately.
- Do not invent API endpoints, database tables, environment variables, test results, or provider integrations.
- Keep documentation readable, professional, maintainable, and suitable for future developers and AI coding agents.

## 6. SCOPE RESTRICTIONS

This task is primarily to update documentation.

- Do not rebuild the application.
- Do not replace the frontend or backend framework.
- Do not delete existing documentation or project files.
- Do not install packages or expose credentials.
- Do not implement an AI provider integration as part of this task.
- Do not overwrite unrelated project work.
- If the repository contains important contradictions or missing decisions, document them and report them instead of guessing.

If an essential decision is missing, make the safest minimal documentation proposal, label it as **PROPOSED — NEEDS APPROVAL**, and continue with the rest of the documentation.

## 7. FINAL VERIFICATION AND REPORT

When finished, provide a concise but complete report containing:

1. Every Markdown file inspected.
2. Every file created or modified.
3. A summary of the changes in each file.
4. Any contradictions resolved.
5. Any assumptions or decisions still requiring approval.
6. Broken links or other documentation issues found.
7. Verification performed and its actual results.
8. Confirmation that application functionality was not unintentionally changed.
9. Recommended next implementation stage for SokoTZ Assistant.

Make the edits directly in the existing repository and preserve all unrelated work.

**Success condition:** All relevant project documentation consistently describes the SokoTZ Assistant, its scope, architecture, security, testing, and roadmap without claiming that the chatbot has already been implemented.