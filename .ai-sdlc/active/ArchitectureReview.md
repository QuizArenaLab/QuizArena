# Architecture Review — Capability Sprint 05

**Role:** Architecture Reviewer
**Feature:** Scoring & Leaderboards

## Questions Evaluated

**1. Is the scoring idempotent?**
- YES. The `evaluateAttempt` method uses a transaction that checks if a `SubmissionRecord` already exists for the given `attemptId`. If it does, it skips recalculation and returns the existing result. This makes it completely safe for retries in a background queue.

**2. Is the Leaderboard query fast?**
- YES. By projecting the individual attempt scores into a flat `RankingSnapshot` table, and tracking aggregations (highest score, participant count) in `LeaderboardProjection`, the public Leaderboard API `GET /leaderboard` executes a simple indexed `findMany` rather than a complex `GROUP BY` calculation across millions of raw answers.

**3. Does it handle negative marking correctly?**
- YES. The engine dynamically looks up `marks` and `negativeMarks` on a per-question basis from the `CompetitionQuestion` bridge table. This allows the same underlying `Question` to have different scoring weights depending on which competition it is placed in.

**Verdict:** PASS
