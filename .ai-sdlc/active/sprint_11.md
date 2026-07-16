# Sprint 11: Authentication & Layout Bug Fixes

## Goal
Fix critical bugs in the authentication flow and layout system that were preventing users from seeing the sidebar and bypassing the onboarding flow.

## Issues Addressed
1. **Sidebar Missing for New Users**: The navigation registry expected a lowercase role string (`user`), but the session provided an uppercase role (`USER`). This was fixed in `WorkspaceShell.tsx`.
2. **Onboarding Bypass**: Due to Next.js middleware constraints, `proxy.ts` cannot natively protect routes. As a result, the fallback protection in `layout.tsx` was reinforced with strict boolean checking, and the JWT token payload was updated to strictly default to `false`.

## Verification
- [ ] Users with `USER` role can see the sidebar items.
- [ ] New Google OAuth signups are intercepted in `layout.tsx` and redirected to `/onboarding`.

## Status
In Progress
