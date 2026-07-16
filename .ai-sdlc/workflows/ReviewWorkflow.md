# Review Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.4.md](../constitution/AI-SDLC-v1.4.md)

## Workflow Definition
The review workflow ensures all implementation efforts are rigorously evaluated for both architectural adherence and functional quality, verifying that the entire business capability is complete.

`IMPLEMENTATION_COMPLETE` -> `EVIDENCE_COMPLETE` -> `ARCHITECTURE_PASS` -> `QA_PASS`

## Dependencies
- **Evidence Collection** cannot begin until `ImplementationReport.md` is finalized and the `Verification Matrix` is defined. The Evidence Engineer strictly executes the Automated Verification tasks defined in the matrix.
- **Architecture Review** cannot begin until `EvidenceReport.md` is finalized.
  - Architecture Review shall explicitly verify:
    - Business Rules satisfied
    - Verification Strategy sufficient
    - Capability complete
- **QA** cannot begin until `ArchitectureReview.md` explicitly states `PASS` for all criteria.
  - QA shall explicitly verify:
    - Acceptance Criteria
    - User Journey
    - Business Outcomes
    - Evidence completeness

## Participating Workers
- Evidence Engineer (Collects)
- Architecture Reviewer (Reviews)
- Quality Assurance Engineer (Reviews)

## Failure Propagation
If any review stage yields a `FAIL` or `REJECT` status, the sprint immediately enters the `FailureWorkflow.md`. Subsequent review stages are halted until the failure is resolved.

## Approval Criteria
A review is considered successful only when all mandatory checklist items are marked `VERIFIED` and the final decision is `PASS`.
This includes verifying that the entire capability works end-to-end and that minor improvements are tracked inside the capability checklist rather than deferred.
