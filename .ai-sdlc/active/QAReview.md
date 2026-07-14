# QA Review — Capability Sprint 05

**Role:** QA Engineer
**Feature:** Scoring & Leaderboards

## Checks Evaluated

**1. Scoring Accuracy:**
- Correct answers yield `+marks`. Incorrect answers yield `-negativeMarks`. Unanswered questions are neutral.

**2. Leaderboard Tie-Breakers:**
- The Leaderboard accurately recalculates ranks based on an `ORDER BY score DESC, completionTime ASC`. If two users score 100, the one who submitted faster is ranked higher.

**3. Leaderboard UI:**
- The public `GET /leaderboard` API works flawlessly.
- The React component maps through the participants, correctly rendering rank medals (🥇, 🥈, 🥉) for the top 3 spots, and visually highlights the current user's row so they can easily find themselves.

**Verdict:** PASS
