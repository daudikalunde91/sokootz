# SokoTZ — Security Requirements

## 0. Implemented controls (2026-10-23)
- Authentication: Firebase Auth (email/password, Google); passwords are handled only by Firebase. Sessions persist in Firebase's browser storage, not app-managed localStorage.
- Authorization: Firestore Security Rules (Android repo). Website writes are built from the Auth UID and never send privileged fields (role, isVerified, rating, reviewCount, isFeatured, viewsCount, ownerId/businessId changes). 23 emulator rule tests cover these cases.
- Public pages show only PUBLISHED listings. **Known gap:** the rules still let anyone read DRAFT listings directly (AUDIT_REPORT §3.4).
- **Known gap:** deployed production rules differ from the repository rules (AUDIT_REPORT §3.1).
- Uploads: JPG/PNG/WebP ≤10 MB, re-encoded to ≤600px JPEG under the 250,000-char rule limit; only safe image sources are rendered.
- Secrets: none in browser code. The Firebase web config is publishable. AI credentials stay in the server route.


## 1. Core Rule
Security controls must be implemented and verified, not merely described in documentation.

## 2. Authentication
Use established authentication mechanisms, secure password hashing and appropriate session or token handling. Password recovery must use a secure, expiring process.

## 3. Authorization
Enforce permissions on the backend for every protected action. Users must not access another user's private resources by changing an identifier.

## 4. Input and Upload Validation
Validate and normalize inputs server-side. Protect against injection, cross-site scripting, malicious uploads and unsafe file paths.

## 5. Secrets
Keep credentials, signing keys and API secrets outside source control. Use environment configuration and rotate exposed secrets.

## 6. Web Security
Configure HTTPS in production, appropriate CSRF/CORS controls, secure cookies where applicable, rate limits and safe error messages.

## 7. Roles
Define and test permissions for visitors, customers, business owners, moderators and administrators.

## 8. Privacy
Collect only necessary data. Avoid logging passwords, access tokens or unnecessary personal information.

## 9. Operations
Maintain dependencies, backups, migration discipline, access logs and an incident response procedure.

## 10. Verification
Test unauthorized access, privilege escalation, invalid inputs, password recovery, upload restrictions and sensitive configuration exposure.

## 11. SokoTZ Assistant Security (Planned)
Status: Planned. None of the controls below is implemented or verified, and this section does not show that the assistant is secure. Requirements are in [SRS.md](SRS.md) (FR-018, FR-022 to FR-027, NFR-001, NFR-002, NFR-009, NFR-010); the product reference is [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md).

### 11.1 Principles
- All text reaching the AI model is untrusted: user messages, listing and business text, help content, and previous model output.
- Security rules are enforced by backend code, never only by instructions in a prompt. A prompt can be bypassed; backend authorization cannot be talked around.
- The assistant never has more access than the requesting user has in the normal interface. It runs read-only retrieval under the user's identity in the MVP.

### 11.2 Prompt injection and malicious input
- Direct injection (for example "ignore your rules" or requests to reveal hidden instructions): the model must not hold secrets, so revealing its instructions causes no harm; permissions and limits do not depend on the model obeying.
- Indirect injection: listing descriptions, business names, reports and help content are user-generated or editable data. They are passed to the model as clearly delimited data, never as instructions, and the MVP exposes no write operations, so injected text cannot trigger actions.
- Validate and limit input length and format on the server. Validate model output before use: references must match retrieved records, links come from the backend, malformed output falls back to a safe message.
- Moderators can remove listings that contain injection text; test data must include such listings.

### 11.3 Authorization and private-data leakage
- Every retrieval operation checks the requesting user's authentication, role and ownership on the backend. Identifiers supplied through chat are never trusted.
- Only data the user may see in the normal interface is sent to the model or returned. Other users' private data, administrative data and private analytics are never included in prompts.
- Conversation context is never shared between users. Cached answers must not mix results across permission levels.
- Error messages, logs and responses must not reveal system instructions, internal identifiers, stack traces, provider details or other users' data.

### 11.4 Output handling
- Render assistant text as plain text or sanitized limited formatting. Never render raw HTML.
- Display only backend-generated links. Do not render URLs or images supplied by the model, which also prevents data being leaked through image or link requests.

### 11.5 Secrets and credentials
- AI provider credentials are stored only in backend environment configuration, never in the frontend bundle, repository, logs, client-visible errors or documentation examples.
- Use least-privilege, per-environment credentials, set provider-side spending limits where the provider supports them, and rotate credentials immediately if exposure is suspected.

### 11.6 Abuse prevention and cost control
- Rate limits per user, per anonymous client and globally; limits on message length, output length and conversation length; a global spending cap with alerts (values PENDING).
- Stricter limits for visitors who are not logged in. Additional bot protection for anonymous use is PROPOSED — NEEDS APPROVAL.
- A configuration switch to disable the assistant quickly (FR-027, PROPOSED).

### 11.7 Consequential actions and confirmation
- The MVP exposes no create, update or delete operation to the assistant.
- Any later action requires an approved requirement, authentication, server-side authorization and a server-enforced confirmation step that shows exactly what will change and is tied to the user's authenticated session. A model's output, or a chat message such as "yes", is not authorization by itself. Every such action is audit logged.

### 11.8 Privacy and data protection
- Send the provider only what a request needs. Never send passwords, tokens, session data or other users' private data.
- Do not store conversation content unless a storage and retention policy is approved ([DATABASE_DESIGN.md](DATABASE_DESIGN.md)). Do not log message content by default; never log passwords, tokens or credentials.
- Before launch, review the AI provider's data handling terms (retention, use for training, processing location, subprocessors) and the applicable Tanzanian data-protection requirements with qualified counsel. This document is not legal advice. The user-facing privacy disclosure is PENDING.
- The assistant never asks for passwords, one-time codes, API keys or payment details.

### 11.9 Uploads
File, image or voice input is not supported. If it is added later it needs a separate security review covering Section 4 upload controls and instructions hidden inside files.

### 11.10 Monitoring and incident response
Record security-relevant assistant events as metadata (rate-limit hits, rejected input, validation failures, suspected injection, provider errors) and alert on unusual spikes. Add assistant scenarios (leaked provider key, data-leak report, injection incident, provider breach) to the incident response procedure.

### 11.11 Verification
Security tests for this section are listed in [TEST_PLAN.md](TEST_PLAN.md). Record each control as implemented, tested, incomplete or not yet assessed.

## 12. Honest Status
Record which controls are implemented, tested, incomplete or not yet assessed. Do not claim that the application is secure solely because this document exists.
All assistant controls in Section 11 are currently Planned and have not been assessed.
