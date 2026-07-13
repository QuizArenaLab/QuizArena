# Security Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: SEC-001
**Category:** Security
**Classification:** Mandatory
**Statement:** Secrets and environment variables must never be committed to the repository.
**Rationale:** Prevents catastrophic credential leaks.
**Examples:**
- **Good:** Using `.env` files that are `.gitignore`d.
- **Bad:** Hardcoding API keys in source code.
**Related Standards:** CODE-001
**Referenced Constitution Article:** Security Rules

### Rule ID: SEC-002
**Category:** Security
**Classification:** Mandatory
**Statement:** All external inputs must be validated prior to processing.
**Rationale:** Mitigates injection attacks and logic failures.
**Examples:**
- **Good:** Using validation schemas (e.g., Zod) on all incoming API payloads.
- **Bad:** Directly inserting user input into a SQL query or trusting incoming JSON structures.
**Related Standards:** ARCH-001
**Referenced Constitution Article:** Security Rules

### Rule ID: SEC-003
**Category:** Security
**Classification:** Mandatory
**Statement:** Apply the Principle of Least Privilege across all boundaries and integrations.
**Rationale:** Limits the blast radius of compromises.
**Examples:**
- **Good:** Database user only has read/write permissions for specific tables.
- **Bad:** Database user is an unrestricted admin.
**Related Standards:** ARCH-001
**Referenced Constitution Article:** Security Rules
