# Launch Countdown Plan

This is the exact day-by-day sprint plan to hit the engineering target of **26 July 2026**.

**Rule of execution**: Do not move to the next day's tasks if a P0 is incomplete. Stay on it until it ships.

---

## Phase 1: Core Journey Integration (T-13 to T-10)
*Focus: Admin can create competitions, users can pay and access them.*

**T-13 (July 14): Competition API Exposure**
**Deliverables:**
- `CompetitionOperationsService` wired to API routes.
- Admin Create/Publish Competition UI functional.
- Architecture PASS & QA PASS.
- Documentation complete.

**T-12 (July 15): Commerce Webhook Loop**
**Deliverables:**
- `WebhookProcessor` for Razorpay implemented.
- Successful payment maps an entitlement record.
- Architecture PASS & QA PASS.

**T-11 (July 16): Commerce Edge Cases**
**Deliverables:**
- Payment Failure graceful UI implemented.
- Competition Discovery dashboard wired for Candidates.
- Architecture PASS & QA PASS.

**T-10 (July 17): Question Authoring**
**Deliverables:**
- Draft -> Publish flow for Questions finalized.
- Question Bank fully usable for Admins.
- Architecture PASS & QA PASS.

---

## Phase 2: Assessment & Evaluation (T-9 to T-6)
*Focus: Users can take the exam flawlessly and see their results.*

**T-9 (July 18): Assessment Auto-Save & State**
**Deliverables:**
- Candidate Exam UI wired to `SubmissionResult` API.
- Auto-save every answer.
- Refresh restores state completely.
- Architecture PASS & QA PASS.

**T-8 (July 19): Exam UX & Anti-Cheat**
**Deliverables:**
- Countdown timer strictly enforces end-time.
- Anti-cheat (tab switching violation logging) active.
- Architecture PASS & QA PASS.

**T-7 (July 20): Leaderboard Generation**
**Deliverables:**
- `LeaderboardReadModelBuilder` connected to frontend UI.
- Scores and ranks accurately aggregated on submission.
- Architecture PASS & QA PASS.

**T-6 (July 21): Certificates & Rewards**
**Deliverables:**
- PDF Certificate generation functional.
- Winner Announcement view built.
- Architecture PASS & QA PASS.

---

## Phase 3: Launch Polish & Operations (T-5 to T-1)
*Focus: Marketing, Admin visibility, and Production readiness.*

**T-5 (July 22): Admin Customer Support Dashboard**
**Deliverables:**
- Remaining CRUD tables wired in `src/app/(admin)`.
- Admin manual fix flows (payment/submission) verified.
- Architecture PASS & QA PASS.

**T-4 (July 23): Marketing & Conversion**
**Deliverables:**
- Landing Page CTA overhauled.
- Trust Signals and basic SEO meta tags added.
- QA PASS (Conversion metrics).

**T-3 (July 24): Security & Infrastructure**
**Deliverables:**
- Rate Limiting active on Auth, Payment, Submission.
- `.env.production` finalized.
- Telemetry/monitoring deployed.

**T-2 (July 25): End-to-End QA (The Dry Run)**
**Deliverables:**
- Code Freeze.
- 5 full mock users complete: Registration -> Pay -> Take Exam -> View Leaderboard -> Get Certificate.
- Blocking bugs resolved.

**T-1 (July 26): Target Reached**
**Deliverables:**
- Engineering Target locked.
- System shipped to Staging for business sign-off.
- Launch Dashboard all green.
