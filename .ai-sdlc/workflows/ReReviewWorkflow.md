# Re-Review Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../constitution/AI-SDLC-v1.0.md)

## Workflow Definition
When an implementation fails Architecture Review or QA, it must be reworked and fully re-evaluated. No shortcuts are permitted.

## Re-Review Pipeline
`Failed Review` -> `Implementation Update` -> `Evidence Refresh` -> `Architecture Review` -> `QA` -> `Documentation`

1. **Implementation Update:** Implementation Engineer applies mandatory fixes.
2. **Evidence Refresh:** Evidence Engineer gathers new evidence on the updated repository state.
3. **Architecture Review:** Architecture Reviewer completely re-evaluates the implementation.
4. **QA:** QA Engineer performs full regression and verification.
5. **Documentation:** Documentation Engineer records the rework iterations.

## Enforcement
The Engineering Manager guarantees that the Evidence, Architecture, and QA stages are entirely re-run. Previous passes do not carry over.
