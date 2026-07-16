# Documentation Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.4.md](../constitution/AI-SDLC-v1.4.md)

## Workflow Definition
The documentation workflow guarantees that every repository change is permanently recorded in the canonical engineering formats.

## Participating Workers
- Documentation Engineer
- Engineering Manager (Verifies completion)

## Responsibilities and Flow
1. **Artifact Generation:** The Documentation Engineer consumes the QAReview, ArchitectureReview, and ImplementationReport to build the `DocumentationSummary.md`.
   Documentation shall explicitly summarize:
   - Capability Delivered
   - Business Outcome
   - Acceptance Criteria Status
   - Verification Summary
   - Remaining Risks
   - Release Impact
   - Business Value Delivered
2. **Manifest Updates:** The `SprintManifest.md` is updated to reflect the final state, deliverables, and dependencies.
3. **Knowledge Preservation:** The Documentation Engineer updates `SprintLedger.md` with the completed sprint information.
4. **Repository Updates:** Any necessary updates to the main `README.md` or related knowledge bases are applied.

## Consumed Artifacts
- QAReview.md
- ArchitectureReview.md
- ImplementationReport.md

## Produced Artifacts
- DocumentationSummary.md
- SprintManifest.md
