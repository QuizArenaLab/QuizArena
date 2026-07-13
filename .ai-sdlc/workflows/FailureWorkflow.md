# Failure Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../constitution/AI-SDLC-v1.0.md)

## Workflow Definition
This workflow is triggered whenever an evaluation yields a `FAIL`, `REJECT`, or unresolvable `NOT VERIFIED` status.

## Escalation Path
1. **Identification:** Reviewer flags a `FAIL` or `REJECT` in their respective report.
2. **Halt:** The Engineering Manager immediately pauses the sprint state machine.
3. **Rework Required:** The Failure is routed back to the Implementation Engineer, accompanied by the mandatory fixes.
4. **Re-entry:** Once the fixes are applied, the sprint enters the `ReReviewWorkflow.md`.

## Failure Escalation
If a failure persists through 3 iterations of rework, or if it fundamentally compromises the sprint plan, the Engineering Manager must escalate the issue to the **Chief Architect** for architectural revision or sprint cancellation.
