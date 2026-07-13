# Dependency Resolution

Defines required artifacts, reports, checklists, standards, workers, and automatic validation.

## Dependency Types
Dependencies are classified to inform the automation engine's behavior.

### Hard Dependencies
Must be satisfied for execution to proceed. Missing hard dependencies block the workflow.
- Example: `ArchitectureReview.md` must exist and pass before QA begins.

### Soft Dependencies
Enhance execution but are not strictly required. Missing soft dependencies may trigger a warning but do not block.
- Example: `Developer Playground` setup for localized testing.
