# SokoTZ — System Architecture

## 1. Architecture Purpose
Document the actual current system and the approved target design. Never describe a proposed component as already implemented.

## 2. Proposed Technology Direction
- Frontend: React with Vite.
- Backend: Django REST Framework.
- Database: PostgreSQL.
- Version control: Git.
- External contact: phone links and WhatsApp click-to-chat.
These choices remain proposals until approved and checked against the repository.

SokoTZ Assistant adds one further external dependency, an AI model provider. **The provider, model and hosting are not selected** (PENDING; see [DECISIONS.md](DECISIONS.md)). Nothing in this document may be read as choosing one.

## 3. Component Responsibilities
Frontend: user interface, navigation, form interaction and API consumption.
Backend: business rules, authentication, authorization, validation and API endpoints.
Database: persistent structured application data and relationships.
File storage: validated listing images and other approved uploads.
Administration: privileged moderation and platform management.

## 4. Communication
The frontend communicates with the backend through documented APIs. The backend validates requests, checks permissions, accesses the database and returns appropriate responses.

SokoTZ Assistant traffic follows the same rule: the frontend never calls the AI provider or the database directly (see Section 12).

## 5. Security Boundaries
All important permissions must be enforced server-side. Frontend visibility alone is not access control.

## 6. Configuration
Use environment variables for environment-specific configuration and secrets. Provide safe example configuration without real credentials.

## 7. Deployment
Document development, testing and production environments, static assets, database migrations, HTTPS, logs, backups and recovery procedures.

## 8. Reliability
Define API error formats, logging expectations, health checks and recovery steps. Avoid claiming availability or scalability targets that have not been agreed and tested.

## 9. International Expansion
Keep country, region, currency and language assumptions explicit. Introduce country-specific behavior through deliberate design rather than hardcoded Tanzania-only assumptions everywhere.

## 10. Architecture Changes
Record material changes in DECISIONS.md. Update database, security, testing and deployment documentation when affected.

Assistant-related changes also update [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md).

## 11. Repository Evidence
Before implementation, inspect current source files, dependencies, scripts and configuration to establish the real architecture.

## 12. SokoTZ Assistant Integration (Planned)
Status: Planned; no assistant component exists yet and none is described here as implemented. Follow the approved stack (Section 2 and DEC-003) and the repository's actual structure; do not introduce a different framework for the assistant. The detailed reference is [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md). Specific endpoints, configuration variables and data shapes are **not yet defined** and must be added to the project's API and configuration documentation when designed.

### 12.1 Components and responsibilities
- Frontend: chat interface, rendering of messages, result cards and draft blocks, loading and error states. It sends user messages to the backend and renders what the backend returns. It holds no AI credentials and never contacts the AI provider.
- Backend assistant layer (conceptual): authenticates the caller, validates requests, applies rate limits and usage caps, decides what data is needed, runs controlled retrieval, calls the AI provider through an adapter, validates the result, builds links and returns a response.
- Controlled retrieval operations: read-only, allowlisted backend operations that run with the requesting user's permissions. Marketplace search should reuse the same search and visibility rules as the standard search (FR-006) so the assistant cannot see more than the normal interface shows.
- Help content source: approved platform help content used to answer FAQs. Its storage location and owner are PENDING.
- AI provider adapter: the only place with provider-specific code, so the provider can be replaced. Credentials are read from backend environment configuration.
- Database: unchanged in the MVP unless a storage decision is approved (see [DATABASE_DESIGN.md](DATABASE_DESIGN.md)).

### 12.2 Intended request flow
1. The user sends a message through the frontend.
2. The backend authenticates the user if logged in, validates the request (size, format), and applies rate limits and usage caps.
3. The backend determines whether the request needs marketplace data, help content or drafting. Where marketplace data is needed, it retrieves it from the real database through authorized search operations.
4. The AI model interprets the request and writes an explanation based only on the retrieved data or approved help content. Retrieved text is passed as untrusted data.
5. The backend checks the output: every listing or business reference must match a retrieved record, links are built from record identifiers, model-written URLs are removed, and malformed output is replaced by a safe fallback.
6. The frontend displays the text and result cards with links to the actual listings.

**PROPOSED — NEEDS APPROVAL:** the AI model may only suggest structured search parameters (name, category, location), which the backend validates and passes to the existing search; the model never builds database queries and never has direct database access. Whether this step is done by the model or by backend rules is open.

### 12.3 Integration boundaries
- The AI model has no direct access to the database, file storage, network or credentials. It can only use the retrieval operations the backend explicitly exposes to it.
- No write operation is exposed to the assistant in the MVP.
- Authorization is decided by backend code, not by instructions in a prompt.
- The assistant layer must not bypass existing business rules, validation or ownership checks.
- Failure of the assistant, the provider or the help-content source must not affect other marketplace features (NFR-004). **PROPOSED:** a configuration switch lets an operator disable the assistant (FR-027).

### 12.4 Reliability and cost
- The backend enforces a timeout on provider calls (value PENDING), limits retries and returns a friendly error when it gives up.
- Per-user and global usage limits, maximum input length, maximum output length and conversation-length limits control cost (values PENDING).
- Operational metadata is logged (request time, outcome, error category, usage counts). Message content, passwords and tokens are not logged unless an approved retention policy allows it.
- **PROPOSED:** non-streaming responses in the MVP, because the backend must validate the complete output before showing links. Streaming is open.

### 12.5 International expansion
Language, country, currency and location handling for the assistant must be configurable and not hard-coded to Tanzania; the MVP supports Kiswahili and English for Tanzania only.

### 12.6 Status
Components, endpoints, configuration and provider integration are Planned or Proposed. Record each as implemented only when the code exists in the repository and update this section.
