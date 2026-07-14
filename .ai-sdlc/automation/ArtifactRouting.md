# Artifact Routing

Defines the Producer-to-Consumer mappings for all artifacts in the system, and their lifecycle.

## Artifact Lifecycle States
- `CREATED`: Artifact is initially generated.
- `UNDER_REVIEW`: Artifact is being evaluated by a downstream worker.
- `APPROVED`: Artifact has passed required reviews.
- `SUPERSEDED`: A newer version of the artifact has replaced this one.
- `ARCHIVED`: Artifact is stored permanently in a release archive (not applicable to individual sprints).

## Producer to Consumer Routing
Example of standard artifact routing:
- **Implementation Report** -> Evidence Engineer
- **Evidence Report** -> Architecture Reviewer
- **Architecture Review** -> Quality Assurance Engineer
- **QA Review** -> Documentation Engineer
- **Documentation Updates** -> Repository Automation
