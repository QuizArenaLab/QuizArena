# Sprint State Machine

Defines the macro-level states of a sprint and their strict ownership.

## State Ownership Matrix
| State | Owner |
|-------|-------|
| Planning | Chief Architect |
| Implementation | Implementation Engineer |
| Evidence | Evidence Engineer |
| Architecture | Architecture Reviewer |
| QA | Quality Assurance Engineer |
| Documentation | Documentation Engineer |
| Ready For Lock | Engineering Manager |
| Locked | Human Product Owner |

## Transitions
`PLANNING` -> `IMPLEMENTATION` -> `EVIDENCE` -> `ARCHITECTURE` -> `QA` -> `DOCUMENTATION` -> `READY_FOR_LOCK` -> `LOCKED`
