# Capability State Machine

Defines the macro-level states of a capability lifecycle and their strict ownership.

## Official Capability States

`IDEA`
↓
`UNDER_ANALYSIS`
↓
`SPECIFICATION_READY`
↓
`BUSINESS_APPROVED`
↓
`READY_FOR_ARCHITECTURE`
↓
`ARCHITECTURE_APPROVED`
↓
`READY_FOR_IMPLEMENTATION`
↓
`IMPLEMENTATION_COMPLETE`
↓
`EVIDENCE_COMPLETE`
↓
`ARCHITECTURE_PASS`
↓
`QA_PASS`
↓
`DOCUMENTED`
↓
`LOCKED`
↓
`RELEASED`

## State Ownership Matrix
| State | Owner |
|-------|-------|
| IDEA -> BUSINESS_APPROVED | Product Business Analyst |
| READY_FOR_ARCHITECTURE -> ARCHITECTURE_APPROVED | Chief Architect |
| READY_FOR_IMPLEMENTATION -> IMPLEMENTATION_COMPLETE | Implementation Engineer |
| EVIDENCE_COMPLETE | Evidence Engineer |
| ARCHITECTURE_PASS | Architecture Reviewer |
| QA_PASS | Quality Assurance Engineer |
| DOCUMENTED | Documentation Engineer |
| LOCKED | Engineering Manager |
| RELEASED | Human Product Owner |

State transitions shall be deterministic. No state may be skipped.
