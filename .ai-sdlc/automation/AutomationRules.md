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
**When:** Capability transitions to ARCHITECTURE or IMPLEMENTATION
**Then:** Ensure `BusinessAnalysisChecklist` = PASS
Engineering shall never begin before BusinessAnalysisChecklist = PASS

## Capability Status Transitions
IDEA
↓
UNDER_ANALYSIS
↓
READY_FOR_REVIEW
↓
APPROVED
↓
READY_FOR_ARCHITECTURE
↓
ARCHITECTURE
↓
IMPLEMENTATION
