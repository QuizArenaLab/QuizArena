# Documentation Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: DOC-001
**Category:** Documentation
**Classification:** Mandatory
**Statement:** Markdown rules must be strictly adhered to for all SDLC artifacts. All reports must contain defined status flags.
**Rationale:** Ensures readability and machine-parsability of engineering records.
**Examples:**
- **Good:** Using standard Markdown headers, code blocks, and the `[ ] VERIFIED` format.
- **Bad:** Writing freeform prose without structure.
**Related Standards:** REP-001
**Referenced Constitution Article:** Governance Rules

### Rule ID: DOC-002
**Category:** Documentation
**Classification:** Recommended
**Statement:** Diagrams (e.g., Mermaid.js) should be utilized in architecture and lifecycle documentation.
**Rationale:** Visual representations clarify complex workflows and dependencies.
**Examples:**
- **Good:** Embedding a mermaid flow chart for sprint states.
- **Bad:** Using external image links that break over time.
**Related Standards:** DOC-001
**Referenced Constitution Article:** Governance Rules

### Rule ID: DOC-003
**Category:** Documentation
**Classification:** Mandatory
**Statement:** The repository changelog must be updated with every Sprint Manifest closure.
**Rationale:** Preserves historical context of system evolution.
**Examples:**
- **Good:** Adding a concise summary of SDLC sprint outcomes to `CHANGELOG.md`.
- **Bad:** Relying purely on Git commit history.
**Related Standards:** GIT-001
**Referenced Constitution Article:** Governance Rules
