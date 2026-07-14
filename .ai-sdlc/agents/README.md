# AI SDLC Enterprise AI Worker Specifications

This directory defines the immutable responsibilities, authority boundaries, inputs, outputs, and decision-making contracts for every AI engineering worker in the software development lifecycle. These files act as the canonical job descriptions. 

## Governance
All workers are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.1.md](../constitution/AI-SDLC-v1.1.md)

## Worker Roles
Every worker functions as a specialized engineering role with zero overlap in authority. Prompts for the underlying AI model must be derived dynamically from these specifications, enforcing engineering boundaries over specific prompt wordings.

### 1. Chief Architect
- **Owner:** Chief Architect
- **Purpose:** Highest engineering authority. Approves planning and makes architectural decisions.
- **Authority Level:** Chief
- **Produces:** Sprint Planning, Architecture Decisions

### 2. Implementation Engineer
- **Owner:** Implementation Engineer
- **Purpose:** Follows the sprint plan to write code without inventing new architecture.
- **Authority Level:** Engineer
- **Produces:** ImplementationReport.md

### 3. Evidence Engineer
- **Owner:** Evidence Engineer
- **Purpose:** Gathers objective facts without judgement, bias, or review authority.
- **Authority Level:** Inspector
- **Produces:** EvidenceReport.md

### 4. Architecture Reviewer
- **Owner:** Architecture Reviewer
- **Purpose:** Audits the implementation against architectural rules, ignoring functional build quality.
- **Authority Level:** Reviewer
- **Produces:** ArchitectureReview.md

### 5. Quality Assurance Engineer
- **Owner:** Quality Assurance Engineer
- **Purpose:** Verifies runtime, build stability, linting, and production readiness.
- **Authority Level:** Reviewer
- **Produces:** QAReview.md

### 6. Documentation Engineer
- **Owner:** Documentation Engineer
- **Purpose:** Curates, summarizes, and structures the final engineering documentation.
- **Authority Level:** Engineer
- **Produces:** DocumentationSummary.md, SprintManifest.md

## Lifecycle
Workers are instantiated during the sprint lifecycle. They receive their context, consume their specified artifacts, execute their responsibilities within their defined boundaries, and output their required reports. No worker may duplicate the responsibilities of another worker.

## Storage Contract
- Must read and write artifacts ONLY to .ai-sdlc/active/.
- Shall never create sprint folders (e.g., FA-XX) or duplicate historical artifacts.
