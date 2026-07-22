# QA-007-F01 Authentication Implementation Plan

> **Status:** Review
>
> **Scope:** QuizArena v1.0
>
> **Framework:** HC AI SDLC
>
> **Purpose:** Standardize engineering planning before implementation begins.

---

# Document Information

| Field                       | Value            |
| --------------------------- | ---------------- |
| Feature                     | Authentication   |
| Feature ID                  | QA-007-F01       |
| Implementation Plan Version | 1.0              |
| Status                      | Review           |
| Owner                       | Engineering Team |
| Created On                  | 2026-07-22       |
| Last Updated                | 2026-07-22       |

---



## Execution Blueprint

| Item | Details |
|------|---------|
| New Files | 20 |
| Modified Files | 3 |
| Database Changes | Yes |
| New Dependencies | 5 |
| Environment Variables | 4 |
| Scope Change | No |

### New Files

| File | Purpose |
|------|---------|
| `src/schemas/index.ts` | Zod validation schemas for auth forms |
| `src/auth.ts` | Auth.js configuration & Prisma Adapter |
| `src/lib/tokens.ts` | Token generation utility (email, password reset) |
| `src/lib/mail.ts` | AWS SES email sending service |
| `src/actions/login.ts` | Server action for login |
| `src/actions/register.ts` | Server action for registration |
| `src/actions/reset.ts` | Server action for password reset |
| `src/actions/new-password.ts` | Server action for new password confirmation |
| `src/actions/new-verification.ts` | Server action for email verification |
| `src/components/auth/card-wrapper.tsx` | UI wrapper for auth forms |
| `src/components/auth/login-form.tsx` | Login UI component |
| `src/components/auth/register-form.tsx` | Registration UI component |
| `src/components/auth/reset-form.tsx` | Password reset UI component |
| `src/components/auth/new-password-form.tsx` | New password UI component |
| `src/components/auth/new-verification-form.tsx` | Email verification UI component |
| `src/app/auth/login/page.tsx` | Login page route |
| `src/app/auth/register/page.tsx` | Registration page route |
| `src/app/auth/reset/page.tsx` | Password reset page route |
| `src/app/auth/new-password/page.tsx` | New password page route |
| `src/app/auth/new-verification/page.tsx` | Email verification page route |

### Modified Files

| File | Reason |
|------|--------|
| `prisma/schema.prisma` | Add `VerificationToken` and `PasswordResetToken` |
| `package.json` | Add Auth dependencies |
| `src/proxy.ts` | Add protected routes configuration |

### Database Changes

| Change | Status |
|---------|--------|
| `VerificationToken` model | New |
| `PasswordResetToken` model | New |

### Dependencies

| Package | Purpose |
|---------|---------|
| `next-auth@beta` | NextAuth v5 for authentication |
| `@auth/prisma-adapter` | Prisma adapter for NextAuth |
| `bcryptjs` | Password hashing |
| `@aws-sdk/client-ses` | Amazon SES transactional emails |
| `zod` | Input validation |

### Environment Variables

| Variable | Required |
|----------|----------|
| `AUTH_SECRET` | Yes |
| `AWS_REGION` | Yes |
| `AWS_ACCESS_KEY_ID` | Yes |
| `AWS_SECRET_ACCESS_KEY` | Yes |
| `EMAIL_FROM` | Yes |
| `NEXT_PUBLIC_APP_URL` | Yes |

### Scope Confirmation

Only the approved Authentication scope will be implemented.

No additional functionality will be introduced.

---

# Purpose

This implementation plan translates an approved QA-007 Feature Execution Artifact into an executable engineering plan.

Implementation shall not begin until this plan has been reviewed and approved.

---

# References

Implementation shall comply with:

- QA-001 Product Baseline
- QA-002 Product Specification
- QA-003 System Architecture
- QA-004 Implementation Plan
- QA-005 Verification Plan
- QA-006 Deployment Plan
- QA-007 Engineering Execution Guide
- QA-007-F01 Authentication

No undocumented functionality shall be introduced.

---

# Implementation Objective

Establish a secure user authentication system for QuizArena, including registration, login, email verification, and password reset functionalities using Next.js App Router, Auth.js v5, and Prisma.

---

# Scope

- User Registration
- User Login
- Email Verification
- Forgot Password
- Password Reset
- Session Management
- Logout
- Protected Routes

---

# Out of Scope

- Social Login
- Multi-Factor Authentication
- Passkeys
- OAuth Providers
- User Profile Management
- Role Administration
- Account Deletion
- Premium Subscription Access

---

# User Review Required

> **Approval is required before implementation begins.**

Please review:

- Scope
- Dependencies
- Open Questions
- Proposed Changes
- Risks

Implementation shall begin only after approval.

---

# Open Questions

> No open questions.

---

# Assumptions

- PostgreSQL is available and Prisma has been configured.
- Tailwind CSS is installed.
- Environment variables for AWS SES and Auth.js exist.
- Next.js App Router is being used.
- `proxy.ts` is the standard for route protection as per Engineering Registry.

---

# Dependencies

## Project Dependencies

- `next-auth@beta` (Auth.js v5)
- `@auth/prisma-adapter`
- `bcryptjs`
- `@types/bcryptjs`
- `zod`
- `@hookform/resolvers`
- `react-hook-form`
- `@aws-sdk/client-ses`

---

## Feature Dependencies

- Engineering Foundation
- Database Foundation

---

## External Dependencies

- Supabase (PostgreSQL)
- Amazon SES (Transactional emails)

---

# Implementation Order

1. Update `package.json` with dependencies.
2. Update `prisma/schema.prisma` with tokens.
3. Configure `src/auth.ts`.
4. Create utilities: `tokens.ts` and `mail.ts`.
5. Create Server Actions.
6. Build UI components and Forms.
7. Create Page routes.
8. Configure `proxy.ts` for route protection.
9. Verify implementation.

---

# Proposed Changes

Summarize all planned work.

---

## Database Changes

- New tables: `VerificationToken`, `PasswordResetToken`

---

## Backend Changes

- Auth.js configuration
- Bcrypt password hashing
- AWS SES integration
- Token generation logic

---

## API Changes

| Endpoint | Method | Purpose |
| -------- | ------ | ------- |
| `/api/auth/*` | POST/GET | Auth.js internal routes |

---

## Frontend Changes

- Login, Register, Reset, New Password, Verification Pages.
- Respective UI Form Components using React Hook Form + Zod.

---

## Validation

- Zod schemas for all forms (Login, Register, Reset, NewPassword)

---

## Security

- Passwords hashed via `bcryptjs`.
- CSRF & Session Management via Auth.js.
- Protected routes using Next.js Middleware (`proxy.ts`).

---

# File Creation Plan

```text
src/
 ├── schemas/
 │    └── index.ts
 ├── lib/
 │    ├── tokens.ts
 │    └── mail.ts
 ├── actions/
 │    ├── login.ts
 │    ├── register.ts
 │    ├── reset.ts
 │    ├── new-password.ts
 │    └── new-verification.ts
 ├── components/
 │    └── auth/
 │         ├── card-wrapper.tsx
 │         ├── login-form.tsx
 │         ├── register-form.tsx
 │         ├── reset-form.tsx
 │         ├── new-password-form.tsx
 │         └── new-verification-form.tsx
 ├── app/
 │    └── auth/
 │         ├── login/page.tsx
 │         ├── register/page.tsx
 │         ├── reset/page.tsx
 │         ├── new-password/page.tsx
 │         └── new-verification/page.tsx
 └── auth.ts
```

---

# File Modification Plan

```text
prisma/schema.prisma
package.json
src/proxy.ts
```

---

# Environment Variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| AUTH_SECRET | Yes | Secret for Auth.js |
| AWS_REGION | Yes | SES Region |
| AWS_ACCESS_KEY_ID | Yes | SES Key |
| AWS_SECRET_ACCESS_KEY | Yes | SES Secret |
| EMAIL_FROM | Yes | Sender Email |
| NEXT_PUBLIC_APP_URL | Yes | App Base URL |

---

# Database Migration Plan

- Add `VerificationToken` and `PasswordResetToken` to schema.
- Run `npx prisma migrate dev --name auth_tokens`.
- Run `npx prisma generate`.

---

# Testing Strategy

## Unit Tests
- Zod schema validations.

---

## Integration Tests
- Server actions input validations and DB integration.

---

## Manual Verification
- Register a user, verify email via AWS SES.
- Login with the verified user.
- Test forgot password flow.
- Verify protected routes redirect unauthenticated users to `/auth/login`.

---

# Implementation Checkpoints

### Checkpoint 1
Dependencies & Database Ready
---
### Checkpoint 2
Auth.js Configuration Ready
---
### Checkpoint 3
Server Actions & Services Ready
---
### Checkpoint 4
Frontend Forms & Pages Ready
---
### Checkpoint 5
Route Protection Ready
---
### Checkpoint 6
Verification Complete

---

# Risks

- AWS SES Sandbox limitations (requires verified identities if not moved out of sandbox).
- Edge compatibility for `bcrypt` (Next.js middleware limitations - will use `bcryptjs` to avoid native node bindings, and ensure auth logic runs on Node runtime rather than Edge if necessary, or split auth config).

---

# Rollback Strategy

- Revert Prisma migration.
- Remove Auth.js configuration.
- Revert route protection rules.

---

# Acceptance Mapping

| Functional Requirement | Implementation |
| ---------------------- | -------------- |
| FR-001 User Registration | `src/actions/register.ts`, `register-form.tsx` |
| FR-002 User Login        | `src/actions/login.ts`, `login-form.tsx`, `auth.ts` |
| FR-003 Email Verification| `tokens.ts`, `mail.ts`, `new-verification-form.tsx` |
| FR-004 Forgot Password   | `reset.ts`, `reset-form.tsx` |
| FR-005 Password Reset    | `new-password.ts`, `new-password-form.tsx` |
| FR-006 Session Mgmt      | `auth.ts` session config |
| FR-007 Logout            | `auth.ts` signout |
| FR-008 Route Protection  | `src/proxy.ts` |

---

# Expected Deliverables

- Source Code
- Database Migration
- APIs
- Components
- Services
- Documentation

---

# Definition of Done

The implementation is complete only when:

- Functional requirements implemented.
- Business rules satisfied.
- Architecture compliance verified.
- Tests pass.
- Build succeeds.
- No TypeScript errors.
- No ESLint errors.
- Documentation updated.
- Verification completed.
- User approval received.

---

# Implementation Approval

| Role               | Status |
| ------------------ | ------ |
| Product Owner      | ☐     |
| Solution Architect | ☐     |
| Engineering Lead   | ☐     |

---

# Engineering Notes

Route protection will use `proxy.ts` strictly as mandated by the Engineering Decision Registry. Due to Next.js Edge limitations, Auth.js `adapter` and `credentials` provider logic might require careful isolation if Edge runtime throws errors regarding `bcryptjs` or `pg`.

---

# Revision History

| Version | Description                 |
| ------- | --------------------------- |
| 1.0     | Initial implementation plan |

---

**End of Document**
