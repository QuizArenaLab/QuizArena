# Architecture Review — Capability Sprint 04

**Role:** Architecture Reviewer
**Feature:** Assessment Runtime (Quiz Engine)

## Questions Evaluated

**1. Is the Timer Trustworthy?**
- YES. The frontend timer is strictly cosmetic. The `session.service.ts` calculates `expiresAt` upon session initialization. All subsequent calls to save answers (`submitAnswer`) or submit (`submitSession`) will inherently fail if the server's clock indicates the `expiresAt` time has passed.

**2. Are boundaries respected?**
- YES. The `CompetitionSession` ensures a 1:1 mapping between a `userId` and `competitionId`. Users cannot start a session unless they hold a `RegistrationState.ENROLLED`.

**3. Is data resilient?**
- YES. The Learner UI pushes answers to the backend (`CompetitionSessionAnswer`) via a `PUT` request immediately upon selection. If a learner's browser crashes or they lose power, their progress is safely stored in the database. When they return, `/current` automatically pre-fills their previous answers.

**4. How is Final Submission Handled?**
- The transition from `SessionState.IN_PROGRESS` to `SUBMITTED` acts as a one-way latch. Further modifications are blocked. Concurrently, a `CompetitionAttempt` record is materialized to capture the total `timeTakenInSeconds`, severing the real-time runtime tracking from the analytical scoring model.

**Verdict:** PASS
