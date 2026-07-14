# Capability: Security Hardening

## Value Proposition
Ensure the QuizArena platform is secure by removing development mocks, protecting all API endpoints against unauthenticated and unauthorized access, and implementing baseline HTTP security headers. This is a critical P0 launch blocker.

## Technical Scope
- **Proxy Authorization**: Enforce RBAC rules on `/api/admin` and `/api/super-admin` routes inside `proxy.ts`. Ensure `/api/competitions` endpoints require authentication.
- **De-mocking Backend**: Replace `MOCK_USER_ID` and `MOCK_ADMIN_ID` placeholders with actual session `auth()` validation in all API routes.
- **HTTP Security Headers**: Configure `next.config.ts` with standard security headers.

## Contract
- [ ] API routes protected by role-based auth.
- [ ] No `MOCK_USER_ID` references remaining in production endpoints.
- [ ] HTTP Security Headers applied via `next.config.ts`.

## Checklist
- [ ] Proxy API Protection
- [ ] Replace `MOCK_USER_ID` with `auth()` session checks
- [ ] Replace `MOCK_ADMIN_ID` with `auth()` session checks
- [ ] Configure `next.config.ts` headers
- [ ] Architecture PASS
- [ ] QA PASS
- [ ] Documentation Updated
- [ ] Git Commit
