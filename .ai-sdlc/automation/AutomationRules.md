# Automation Rules

The execution engine is driven by distinct rules evaluating artifact and state conditions. The orchestration relies on standard Artifacts -> Rules -> Workers execution without custom prompts.

## AUTO-001
**When:** `ImplementationReport` exists AND `EvidenceReport` missing
**Then:** Activate Evidence Engineer

## AUTO-002
**When:** `ArchitectureReview` PASS AND `QAReview` missing
**Then:** Activate Quality Assurance Engineer

## AUTO-003
**When:** `QA` FAIL
**Then:** Activate Implementation Engineer, Invalidate Documentation

## AUTO-004
**When:** `Documentation` PASS AND `Sprint Manifest` exists
**Then:** Engineering Manager evaluates Sprint Lock

## AUTO-005
**When:** Capability transitions to `READY_FOR_IMPLEMENTATION`
**Then:** Evaluate Gating Conditions
Implementation may begin ONLY when all of the following are true:
1. Capability Specification = APPROVED
2. Business Analysis Checklist = PASS
3. Architecture = APPROVED
4. Verification Strategy = GENERATED

Automation shall automatically block any attempt to begin implementation without satisfying these prerequisites.

## Capability Status Transitions
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
