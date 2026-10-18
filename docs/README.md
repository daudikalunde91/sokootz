# SokoTZ

## Overview
SokoTZ is a Tanzania-first business directory and marketplace intended to help customers discover businesses, products and services, with a path to future international expansion.

## Project Status
Current implementation status must be verified against the repository, roadmap and actual test results. Planned features must not be described as completed.
The SokoTZ Assistant is Planned (see below).

## Documentation
Project documentation covers the project brief, requirements, user flows, UI/UX specification, architecture, database design, security, test plan, roadmap and decision log. In the repository these reference documents are expected under docs/ (see the layout note below).

Documents in this set:
- [PROJECT_BRIEF.md](PROJECT_BRIEF.md): product vision and scope.
- [SRS.md](SRS.md): requirements and acceptance criteria.
- [USER_FLOWS.md](USER_FLOWS.md): user journeys.
- [UI_UX_SPEC.md](UI_UX_SPEC.md): interface standards.
- [ARCHITECTURE.md](ARCHITECTURE.md): system structure.
- [DATABASE_DESIGN.md](DATABASE_DESIGN.md): data rules.
- [SECURITY.md](SECURITY.md): security requirements.
- [TEST_PLAN.md](TEST_PLAN.md): verification.
- [ROADMAP.md](ROADMAP.md): stage status.
- [DECISIONS.md](DECISIONS.md): decision log.
- [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md): SokoTZ Assistant reference.
- [AGENTS.md](AGENTS.md): coding-agent instructions.
- Folder references: [frontend.md](frontend.md), [backend.md](backend.md), [tests.md](tests.md).

Layout note: in this documentation archive all Markdown files are in one folder, so the links above are relative to that folder. If the reference documents are moved into docs/, update the links (see DEC-019 in [DECISIONS.md](DECISIONS.md)).

## Repository Structure
- docs/: project reference documentation.
- frontend/: frontend application, if configured here.
- backend/: backend application, if configured here.
- tests/: shared or end-to-end tests, if configured here.
- AGENTS.md: coding-agent instructions.

The actual locations may differ; verify the repository before relying on this example.

## SokoTZ Assistant
SokoTZ Assistant is a **planned** AI-powered chat assistant integrated into the marketplace. **It is not implemented or tested** and must not be described as available. It supports the marketplace and does not replace it.

Intended capabilities (MVP):
- Chat in Kiswahili and English.
- Answer questions about using SokoTZ.
- Find real businesses, products and services by name, category and location, using actual marketplace data, with links to the real listings.
- Help business owners draft product descriptions and promotional text.
- Handle unknown questions, empty results and AI service failures clearly, with privacy protections.

It never invents businesses, prices, availability, ratings, reviews, locations or statistics, and it cannot publish, buy or pay on a user's behalf. The AI provider has not been selected.

Documentation: [SOKOTZ_ASSISTANT.md](SOKOTZ_ASSISTANT.md), [SRS.md](SRS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), [TEST_PLAN.md](TEST_PLAN.md), [ROADMAP.md](ROADMAP.md), [DECISIONS.md](DECISIONS.md).

Setup: there are no verified setup requirements for the assistant yet. When it is built, AI credentials will be kept in backend configuration only and never committed.

## Prerequisites
Use the runtime versions and dependencies declared in the actual frontend/backend configuration.

## Setup and Run
Follow the installation, environment configuration, database migration and startup commands defined by the current project files. Do not copy unverified commands into production instructions.

## Environment Variables
Use a local environment file based on a safe example template where appropriate. Never commit actual credentials, tokens or private keys.

## Testing
Run the test, lint and build commands supported by the repository. Report real outcomes and unresolved failures.

## Development Workflow
1. Read AGENTS.md and relevant docs/.
2. Identify the current roadmap stage.
3. Implement only the approved task.
4. Test the change.
5. Update documentation and decision records where needed.
6. Commit reviewed changes through Git.

## Known Limitations
Record incomplete features, integrations and deployment constraints based on verified repository evidence.
- SokoTZ Assistant is planned and not implemented; its AI provider has not been selected.

## Contributions
Keep changes focused, tested, documented and consistent with approved requirements.
