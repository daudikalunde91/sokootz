# tests/ — Folder Reference

Purpose:
Stores shared integration, end-to-end or other project-level tests where appropriate.

Responsibilities:
- Verify important user journeys.
- Verify frontend/backend integration.
- Detect regressions.
- Validate critical authorization and business rules.
- Support release verification.
- When SokoTZ Assistant is built: cover grounding, authorization, prompt-injection, failure, language and accessibility cases from TEST_PLAN.md Section 8, using a fake provider for deterministic tests.

Reference documents:
- docs/TEST_PLAN.md
- docs/SRS.md
- docs/USER_FLOWS.md
- docs/SECURITY.md
- docs/SOKOTZ_ASSISTANT.md
- AGENTS.md

Rules:
Inspect the existing test configuration before creating this folder. Do not duplicate established test locations unnecessarily. Use isolated test data and safe test settings. Never target production data. Report actual pass/fail results and skipped tests. Never weaken tests merely to make the build pass.

The final test folder structure must follow the real project tooling.
