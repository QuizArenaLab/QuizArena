# Git Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: GIT-001
**Category:** Source Control
**Classification:** Mandatory
**Statement:** Commit messages must follow conventional commits formatting.
**Rationale:** Provides predictable commit history and enables automated changelog generation.
**Examples:**
- **Good:** `feat(sdlc): establish enterprise workflow specifications`
- **Bad:** `fixed stuff`
**Related Standards:** REP-001
**Referenced Constitution Article:** Governance Rules

### Rule ID: GIT-002
**Category:** Source Control
**Classification:** Mandatory
**Statement:** Sprint commits must only be pushed upon successful execution of the Lock Workflow.
**Rationale:** Prevents partially completed or failing code from entering the master branch.
**Examples:**
- **Good:** Committing only after QA Review gives a `PASS`.
- **Bad:** Committing work in progress directly to master during Implementation.
**Related Standards:** REV-001
**Referenced Constitution Article:** Governance Rules
