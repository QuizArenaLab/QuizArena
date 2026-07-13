# Repository Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: REP-001
**Category:** Repository
**Classification:** Mandatory
**Statement:** The repository must maintain a clean separation of `.ai-sdlc` governance folders and standard source code.
**Rationale:** Governance files should never intertwine with application source code.
**Examples:**
- **Good:** `.ai-sdlc/` at the root level, `src/` at the root level.
- **Bad:** SDLC templates stored inside `src/common/`.
**Related Standards:** FOLD-001
**Referenced Constitution Article:** Governance Rules

### Rule ID: REP-002
**Category:** Repository
**Classification:** Mandatory
**Statement:** Artifact storage for closed sprints must be preserved in a structured, immutable archive format.
**Rationale:** Ensures audits can trace exactly what occurred in past sprints.
**Examples:**
- **Good:** Archiving manifests in a dedicated records directory.
- **Bad:** Overwriting previous sprint artifacts.
**Related Standards:** DOC-001
**Referenced Constitution Article:** Governance Rules
