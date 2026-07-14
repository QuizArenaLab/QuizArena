# QA Review — Capability Sprint 04

**Role:** QA Engineer
**Feature:** Assessment Runtime (Quiz Engine)

## Checks Evaluated

**1. Session Initialization:**
- API accurately verifies enrollment before creating a session. Generates `expiresAt` based on Competition config.

**2. State Recovery:**
- Refreshing the `/arena` dashboard triggers the `/current` API. The UI accurately fetches already recorded answers and correctly recalculates the remaining time down to the second.

**3. Timer & Expiration:**
- The frontend `setInterval` accurately displays countdown.
- If the countdown reaches zero, the UI automatically triggers the `submitSession` logic and gracefully kicks the user back to the competition detail page.

**4. Final Lockout:**
- Once `submitSession` is called, the `CompetitionSession` state switches to `SUBMITTED`. Attempting to answer a question after submission yields an error.

**Verdict:** PASS
