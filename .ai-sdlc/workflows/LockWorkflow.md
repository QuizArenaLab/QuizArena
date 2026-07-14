# Sprint Lock Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.1.md](../constitution/AI-SDLC-v1.1.md)

## Workflow Definition
The Lock Workflow is the final stage of the Sprint Lifecycle. It confirms that all work is completed, documented, and safely committed to Git.

## Mandatory Conditions
1. All workflow stages (`PLANNING` through `DOCUMENTATION`) have successfully completed.
2. `ArchitectureReview.md` and `QAReview.md` display a final decision of `PASS`.
3. All required artifacts exist and conform to templates.
4. Engineering Manager has set the state to `READY_FOR_LOCK`.

## Lock Procedure
1. **Repository Updates:** The code and documentation are merged to the main branch.
2. **Git Commit Readiness:** All final changes are staged, committed with a standard message format, and pushed.
3. **Sprint Ledger:** Documentation Engineer updates `.ai-sdlc/SprintLedger.md` to record the completion.
4. **Closure:** No further changes can be made to this sprint. The `active` workspace is now ready to be overwritten by the next sprint.

## Participating Workers
- Engineering Manager (Approves eligibility)
- Human Product Owner / System (Final commit execution)
