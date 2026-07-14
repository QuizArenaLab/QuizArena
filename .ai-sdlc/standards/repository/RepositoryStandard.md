# Repository Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.1.md](../../constitution/AI-SDLC-v1.1.md)

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
**Statement:** Execution artifacts for sprints are temporary and reside in `.ai-sdlc/active/`. Git history and release archives provide permanent records.
**Rationale:** Ensures repository does not scale linearly with sprint count while maintaining full auditability.
**Examples:**
- **Good:** Overwriting active sprint artifacts and relying on Git for history.
- **Bad:** Creating per-sprint folders for archiving artifacts.
**Related Standards:** DOC-001
**Referenced Constitution Article:** Governance Rules
