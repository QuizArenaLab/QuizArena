# Capability Verification Standard

## Governance
[.ai-sdlc/constitution/AI-SDLC-v1.2.md](../../constitution/AI-SDLC-v1.2.md)

## Constitutional Rule
Verification shall be planned before implementation. Every capability plan must include a Verification Strategy generated specifically for the capability being delivered.

Verification planning is the responsibility of the Chief Architect. Verification execution is the responsibility of the Evidence Engineer and Quality Assurance Engineer.

## Verification Catalog
The AI SDLC supports a dynamic catalog of verification categories. The current catalog includes:

* Static
* Build
* Runtime
* Database
* API
* Functional
* UI
* Security
* Performance
* Regression
* Documentation
* Production Readiness

*(Note: Additional categories such as Accessibility, AI Model Validation, or Chaos Testing may be introduced without breaking the catalog structure).*

## Capability Mapping Decision Table
The Chief Architect shall use the following mapping rules to ensure the correct verification categories are selected for different capability types.

| Capability Type | Required Verifications |
| :--- | :--- |
| **Database** | Static, Build, Database, Functional |
| **Frontend** | Static, Build, Runtime, UI |
| **Authentication** | Static, Build, Runtime, Security |
| **Commerce** | Static, Build, Runtime, API, Security, Functional |
| **Landing Page** | Static, Build, Runtime, UI, Production Readiness (SEO, Metadata) |
| **Infrastructure** | Build, Runtime, Production Readiness, Performance |
