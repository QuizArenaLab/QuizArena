# QA Review — Sprint 02

**Role:** QA Engineer
**Feature:** Competition Scheduling & Lifecycle

## Checks Evaluated

**1. Runtime / Routing:**
- All 3 new API routes (`lifecycle/route.ts`, `schedule/route.ts`, `audit/route.ts`) compile and are reachable.
- UI renders properly without circular dependency or hydration errors.

**2. Validation:**
- API routes reject invalid state transitions via Zod native enum schemas.
- Cannot transition from `DRAFT` straight to `LIVE`. Must go through `READY` first.
- Cannot schedule a competition unless it's in `READY` state.
- `publishAt` dates must be valid ISO strings in the future.

**3. State Management in UI:**
- The UI dynamically computes the dropdown options for state transitions based on what the API says is legally allowed (via `validTransitions`). This guarantees the UI cannot even propose an illegal transition to the backend.

**4. Data Accuracy:**
- Denormalized timestamps (`activatedAt`, `completedAt`, `archivedAt`, etc.) are appropriately logged on the `Competition` table upon successful transitions.
- The `CompetitionLifecycleAudit` correctly tracks the chronological history of changes, tracking both `SYSTEM` and `ADMIN` actor types.

**Verdict:** PASS
