# Verification Matrix

## Governance
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

This matrix functions as a responsibility map for the AI SDLC. While the Checklist Traceability Matrix maps rules to checklists, the Verification Matrix answers: **Which worker is responsible for verifying each engineering concern?**

| Concern | Chief Architect | Implementation | Evidence | Architecture | QA | Documentation | Engineering Manager |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Architecture** | Plan | - | Evidence | Verify | - | Document | Approve |
| **Security** | Design | Implement | Evidence | Verify | Verify | Document | Approve |
| **Build** | - | Run | Capture | - | Verify | Record | Approve |
| **Documentation** | Plan | Update | Capture | Review | Review | Publish | Lock |
| **Git** | - | Commit Ready | Evidence | - | Verify | Manifest | Lock |
