# Review Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../constitution/AI-SDLC-v1.0.md)

## Workflow Definition
The review workflow ensures all implementation efforts are rigorously evaluated for both architectural adherence and functional quality.

`IMPLEMENTATION` -> `EVIDENCE` -> `ARCHITECTURE REVIEW` -> `QA`

## Dependencies
- **Evidence Collection** cannot begin until `ImplementationReport.md` is finalized.
- **Architecture Review** cannot begin until `EvidenceReport.md` is finalized.
- **QA** cannot begin until `ArchitectureReview.md` explicitly states `PASS` for all criteria.

## Participating Workers
- Evidence Engineer (Collects)
- Architecture Reviewer (Reviews)
- Quality Assurance Engineer (Reviews)

## Failure Propagation
If any review stage yields a `FAIL` or `REJECT` status, the sprint immediately enters the `FailureWorkflow.md`. Subsequent review stages are halted until the failure is resolved.

## Approval Criteria
A review is considered successful only when all mandatory checklist items are marked `VERIFIED` and the final decision is `PASS`.
