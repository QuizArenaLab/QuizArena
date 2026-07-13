# Folder Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: FOLD-001
**Category:** Repository Layout
**Classification:** Mandatory
**Statement:** The repository layout must distinctly separate Core, Feature, Shared, and Infrastructure logic.
**Rationale:** Keeps the codebase navigable and logically segmented.
**Examples:**
- **Good:** `src/features/auth/`, `src/shared/utils/`
- **Bad:** Dumping all files into `src/` directly.
**Related Standards:** REP-001
**Referenced Constitution Article:** Architecture Rules

### Rule ID: FOLD-002
**Category:** Repository Layout
**Classification:** Mandatory
**Statement:** The `.ai-sdlc` directory is fully reserved for governance (agents, constitution, standards, templates, workflows).
**Rationale:** Protects the engineering brain of the repository.
**Examples:**
- **Good:** Using `.ai-sdlc/standards/` for rules.
- **Bad:** Placing UI components inside `.ai-sdlc`.
**Related Standards:** REP-001
**Referenced Constitution Article:** Governance Rules
