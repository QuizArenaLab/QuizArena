# Version Upgrade Workflow

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../constitution/AI-SDLC-v1.0.md)

## Workflow Definition
This workflow dictates how the SDLC governance structure itself (Constitution, Templates, Worker Specifications, Workflows) is modified.

## Migration Policy
1. **Constitution Updates:** Must be approved by the Chief Architect and Human Product Owner.
2. **Template Updates:** Must be backward compatible or include a migration strategy for active sprints.
3. **Worker Updates:** Adding or modifying roles requires an update to the Sprint Lifecycle.
4. **Workflow Updates:** Altering state machines must not strand active sprints.

## Version Numbering
- Major versions (e.g., v1.0 -> v2.0): Fundamental shifts in the Constitution or state machine.
- Minor versions (e.g., v1.0 -> v1.1): New templates, new optional worker roles, or clarification of responsibilities.

## Participating Workers
- Chief Architect
- Engineering Manager
