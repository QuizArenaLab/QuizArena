# Architecture Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: ARCH-001
**Category:** Architecture
**Classification:** Mandatory
**Statement:** Repositories shall be the only layer permitted to communicate directly with the persistence layer.
**Rationale:** Maintains separation of concerns and prevents database coupling.
**Examples:**
- **Good:** Services call repository methods to save data.
- **Bad:** Controllers execute SQL queries directly.
**Related Standards:** CODE-001
**Referenced Constitution Article:** Architecture Rules

### Rule ID: ARCH-002
**Category:** Architecture
**Classification:** Mandatory
**Statement:** All systems must implement strict layered architecture and separation of concerns.
**Rationale:** Ensures components remain modular, testable, and independently scalable.
**Examples:**
- **Good:** Separation into Routers, Controllers, Services, and Repositories.
- **Bad:** Fat controllers with business and data logic.
**Related Standards:** ARCH-001
**Referenced Constitution Article:** Architecture Rules

### Rule ID: ARCH-003
**Category:** Architecture
**Classification:** Recommended
**Statement:** Favor composition over inheritance.
**Rationale:** Prevents deep, rigid class hierarchies.
**Examples:**
- **Good:** Injecting behavioral interfaces into a class.
- **Bad:** Creating a 5-level deep class extension chain.
**Related Standards:** CODE-003
**Referenced Constitution Article:** Architecture Rules

### Rule ID: ARCH-004
**Category:** Architecture
**Classification:** Mandatory
**Statement:** Apply dependency inversion principle to decoupled high-level logic from low-level infrastructure.
**Rationale:** Business logic should depend on abstractions, not concretions.
**Examples:**
- **Good:** Service depends on `IUserRepository`.
- **Bad:** Service depends directly on `PostgresUserRepository`.
**Related Standards:** ARCH-003
**Referenced Constitution Article:** Architecture Rules
