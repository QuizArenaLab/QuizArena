# Coding Standard

## Governing Authority
All actions are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../../constitution/AI-SDLC-v1.0.md)

## Rules

### Rule ID: CODE-001
**Category:** Coding Practices
**Classification:** Mandatory
**Statement:** Error handling must be explicit and propagate structured errors.
**Rationale:** Prevents unhandled rejections and lost context.
**Examples:**
- **Good:** Using standard structured error classes and returning them to a global handler.
- **Bad:** Silently swallowing errors with `try {} catch(e) {}`.
**Related Standards:** ARCH-001
**Referenced Constitution Article:** Implementation Rules

### Rule ID: CODE-002
**Category:** Coding Practices
**Classification:** Recommended
**Statement:** Prefer immutability when dealing with state and data structures.
**Rationale:** Reduces side effects and makes state management predictable.
**Examples:**
- **Good:** Using `const` and returning new array copies.
- **Bad:** Mutating function parameters.
**Related Standards:** CODE-001
**Referenced Constitution Article:** Implementation Rules

### Rule ID: CODE-003
**Category:** Coding Practices
**Classification:** Mandatory
**Statement:** Strict Null Safety must be enforced.
**Rationale:** Prevents runtime null reference exceptions.
**Examples:**
- **Good:** Checking for null/undefined before accessing properties.
- **Bad:** Using non-null assertions (`!`) indiscriminately.
**Related Standards:** CODE-001
**Referenced Constitution Article:** Implementation Rules

### Rule ID: CODE-004
**Category:** Coding Practices
**Classification:** Mandatory
**Statement:** Asynchronous operations must use standard async/await patterns securely without dangling promises.
**Rationale:** Avoids race conditions and memory leaks.
**Examples:**
- **Good:** Awaiting promises in try/catch blocks.
- **Bad:** Firing async functions without handling the resulting promise.
**Related Standards:** CODE-001
**Referenced Constitution Article:** Implementation Rules
