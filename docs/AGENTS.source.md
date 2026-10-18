# SokoTZ — Agent Instructions

## 1. Read Before Acting
Before starting a task, read this file and the relevant documentation in docs/. Inspect existing source code, configuration and tests before proposing or making changes.

## 2. Source of Truth
Use PROJECT_BRIEF.md for product direction, SRS.md for requirements, USER_FLOWS.md for journeys, UI_UX_SPEC.md for interface standards, ARCHITECTURE.md for system structure, DATABASE_DESIGN.md for data rules, SECURITY.md for security expectations, TEST_PLAN.md for verification, ROADMAP.md for stage status and DECISIONS.md for approved decisions.
SOKOTZ_ASSISTANT.md is the detailed reference for SokoTZ Assistant (see Section 11).

## 3. Stage-Based Work
Follow the specific task prompt for the current stage. Do not implement unrelated future stages unless explicitly requested.

## 4. Preserve the Project
Do not replace the approved stack, remove working features, restructure unrelated files or introduce major dependencies without justification and approval.

## 5. Real Functionality
Do not present fake authentication, fake persistence, mock payments or placeholder integrations as real functionality. Clearly identify mock data and unfinished work.

## 6. Security
Never commit secrets. Validate inputs, enforce server-side authorization and protect resources by ownership. Do not weaken security to make a demo work.

## 7. Testing
Add or update relevant tests. Run verified checks where possible. Never claim tests passed if they were not executed.

## 8. Documentation
Update affected documentation and record important decisions. Keep ROADMAP.md status evidence-based.

## 9. Reporting
At task completion report:
- What changed.
- Files created or modified.
- Commands and tests actually run.
- Actual results and failures.
- Remaining work and risks.
- Recommended next stage.

## 10. Uncertainty
If requirements conflict or a risky change is unclear, explain the conflict and request clarification instead of silently inventing a decision.

## 11. SokoTZ Assistant Rules
SokoTZ Assistant is a planned AI chat feature of the marketplace. Its current status is Planned: no implementation or test evidence exists in this documentation set.
- Read SOKOTZ_ASSISTANT.md first, then the assistant sections of SRS.md (FR-011 to FR-027), ARCHITECTURE.md (Section 12), SECURITY.md (Section 11), DATABASE_DESIGN.md (Section 8) and TEST_PLAN.md (Section 8). Treat SOKOTZ_ASSISTANT.md as the detailed reference.
- Follow the existing architecture and conventions. Do not choose or add an AI provider, SDK, database table, endpoint or environment variable that is not approved in DECISIONS.md and defined in the project documentation. Decisions marked Pending or Proposed are not approved.
- Use real backend and database data. Never fabricate marketplace results, prices, availability, ratings, reviews, locations or statistics, in code, tests or sample data presented as real. Label any mock data clearly.
- Keep AI credentials on the backend only. The AI model must have no direct database access and must not bypass authorization, ownership checks or validation. Treat all text sent to the model, including listing text, as untrusted.
- The MVP assistant is read-only. Do not let it publish, edit, delete, change settings, buy or pay. Any action needs an approved workflow, server-side authorization and an explicit, server-enforced confirmation step.
- Never claim the assistant, or any part of it, is implemented or tested without evidence (code in the repository and recorded test results). Use the labels Planned, Proposed, Implemented and Tested as defined in SOKOTZ_ASSISTANT.md.
- Preserve existing functionality and avoid unrelated refactoring. The marketplace must keep working when the assistant is unavailable.
- Update documentation and tests when implementation changes, including ROADMAP.md status and DECISIONS.md.
- Protect user data, permissions, secrets and production configuration. Do not log passwords, tokens or message content unless an approved policy allows it.
