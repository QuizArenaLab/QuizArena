# Naming Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: NAME-001
**Category:** Naming
**Classification:** Mandatory
**Statement:** Classes and Interfaces must use PascalCase. Interfaces may optionally be prefixed with `I` depending on language norms.
**Rationale:** Ensures universally recognizable types.
**Examples:**
- **Good:** `UserService`, `IUserRepository`
- **Bad:** `userService`, `user_service`
**Related Standards:** CODE-001
**Referenced Constitution Article:** Implementation Rules

### Rule ID: NAME-002
**Category:** Naming
**Classification:** Mandatory
**Statement:** File and Folder naming must be consistent (camelCase or kebab-case) across the repository.
**Rationale:** Prevents cross-platform case-sensitivity issues and keeps navigation predictable.
**Examples:**
- **Good:** `user-controller.ts`, `auth-service/`
- **Bad:** `UserController.ts`, `Auth_service/`
**Related Standards:** FOLD-001
**Referenced Constitution Article:** Implementation Rules

### Rule ID: NAME-003
**Category:** Naming
**Classification:** Mandatory
**Statement:** DTOs (Data Transfer Objects) must include the suffix `Dto`.
**Rationale:** Clearly identifies the purpose and boundaries of the object.
**Examples:**
- **Good:** `CreateUserDto`
- **Bad:** `CreateUserData`
**Related Standards:** ARCH-002
**Referenced Constitution Article:** Implementation Rules
