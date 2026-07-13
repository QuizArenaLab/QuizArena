# AI SDLC Enterprise Verification Checklists

This directory contains the immutable verification checklists that operationalize the Engineering Standards. Every evaluation and review stage must execute against these checklists.

## Governance
All checklists are subordinate to the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../constitution/AI-SDLC-v1.0.md)

## Purpose
Checklists do not define new rules. They operationalize existing Engineering Standards into repeatable, objective review procedures. This ensures engineering quality is measured consistently rather than subjectively.

## Checklist Item Format
Every checklist item follows a structured format linking directly to the Engineering Standards and supporting exactly four outcomes:
`[ ] VERIFIED | [ ] NOT VERIFIED | [ ] NOT APPLICABLE | [ ] FAILED`

No subjective statuses (e.g., "Looks Good", "Partial Pass") are permitted.

### Structure Example:
**Checklist ID:** ARCH-C001
**References:** ARCH-001
**Requirement:** Repository layer is the only layer communicating with persistence.
**Verification:** `[ ] VERIFIED | [ ] NOT VERIFIED | [ ] NOT APPLICABLE | [ ] FAILED`
**Evidence:** ____________________
**Reviewer Notes:** ____________________
