# Testing Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: TEST-001
**Category:** Testing
**Classification:** Mandatory
**Statement:** Build, TypeScript, and Lint verification must pass flawlessly without warnings.
**Rationale:** Ensures absolute baseline code health before entering QA.
**Examples:**
- **Good:** `npm run build` succeeds and produces no linter errors.
- **Bad:** Ignoring a TypeScript error with `@ts-ignore` to pass the build.
**Related Standards:** REV-001
**Referenced Constitution Article:** Quality Assurance Rules

### Rule ID: TEST-002
**Category:** Testing
**Classification:** Recommended
**Statement:** Unit tests should cover core business logic and critical paths.
**Rationale:** Prevents regressions in complex functional boundaries.
**Examples:**
- **Good:** Writing tests for calculation services.
- **Bad:** Writing tests that only mock and verify framework internals.
**Related Standards:** ARCH-002
**Referenced Constitution Article:** Quality Assurance Rules

### Rule ID: TEST-003
**Category:** Testing
**Classification:** Mandatory
**Statement:** Runtime validation and Playground verification must be proven in the Evidence Report.
**Rationale:** Code that builds is not guaranteed to run.
**Examples:**
- **Good:** Providing logs of successful local server execution in the Evidence Report.
- **Bad:** Passing QA purely based on a successful build.
**Related Standards:** REV-001
**Referenced Constitution Article:** Quality Assurance Rules
