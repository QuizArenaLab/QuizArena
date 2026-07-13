# Workflow Engine

Defines state transitions, worker activation, dependency resolution, failure propagation, retry flows, and approval flows.

## Automation Event Model
Automation reacts to events, driving the workflow engine.
Example Event Sequence:
1. `SprintPlanned`
2. `ImplementationStarted`
3. `ImplementationCompleted`
4. `EvidenceCollected`
5. `ArchitecturePassed`
6. `QAPassed`
7. `DocumentationCompleted`
8. `SprintLocked`
