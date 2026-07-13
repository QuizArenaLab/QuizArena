# Review Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: REV-001
**Category:** Code Review
**Classification:** Mandatory
**Statement:** Reviewers must enforce strict PASS / FAIL conditions. There is no partial pass.
**Rationale:** Prevents lowering of quality standards through compromise.
**Examples:**
- **Good:** Marking a review as `FAIL` because a single critical architectural rule is violated.
- **Bad:** Marking as `PASS` but saying "fix this later."
**Related Standards:** ARCH-001, QA-001
**Referenced Constitution Article:** Review Rules

### Rule ID: REV-002
**Category:** Code Review
**Classification:** Mandatory
**Statement:** A Re-review policy must be triggered in full if any code changes occur after an initial failure.
**Rationale:** Prevents regression during fixes.
**Examples:**
- **Good:** Running evidence collection and QA again after the Implementation Engineer pushes a fix.
- **Bad:** Passing QA because "the fix was small."
**Related Standards:** REP-001
**Referenced Constitution Article:** Review Rules
