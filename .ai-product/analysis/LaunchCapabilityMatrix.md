# Launch Capability Matrix

This document evaluates QuizArena v1.0 not by lines of code or module completion percentages, but by **whether a user can successfully transition through the core product journey**. 

It acts as the CEO dashboard for determining GO/NO-GO launch readiness.

## User Journey Capability Check

| Transition Phase | Core Capability | Required | Status | Gap | Priority |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Visitor → Learner** | Visitor understands product in 10s | ✅ | ❌ | Missing strong CTA and Trust Signals on Landing Page. | P0 |
| | SEO discoverability | ✅ | ❌ | Missing meta tags and rich semantic HTML structure. | P1 |
| **Learner → Registered User** | Registration friction is near-zero | ✅ | ✅ | Auth flow is robust. Needs minor error-handling polish. | P1 |
| **Registered User → Paid Participant**| Payment confidence is high | ✅ | ❌ | Missing webhook verification to reliably grant competition access. | P0 |
| | Competition discovery | ✅ | ❌ | Dashboard API wiring needed to fetch available/upcoming competitions. | P0 |
| **Paid Participant → Candidate** | Flawless Exam UX | ✅ | ❌ | Missing real-time auto-save. High risk of data loss on browser refresh. | P0 |
| | Anti-cheat / Trust enforcement | ✅ | ❌ | Violation models exist, UI enforcement needs wiring. | P1 |
| **Candidate → Ranked User** | Instant Results Experience | ✅ | ❌ | Assessment to SubmissionResult API integration incomplete. | P0 |
| | Live Leaderboard visibility | ✅ | ❌ | Read models exist but missing live frontend visualization. | P0 |
| **Ranked User → Winner** | Winner announcement | ✅ | ❌ | Missing automated result publication flow. | P1 |
| | Certificate delivery | ✅ | ❌ | PDF generation engine missing. | P1 |
| **Winner → Returning User** | Referral & Share potential | ✅ | ❌ | Missing social sharing buttons on Certificate/Result views. | P2 |
| **Operational Control** | Customer support capability | ✅ | ❌ | Admin Dashboard missing full CRUD to fix user issues manually. | P1 |
| | Production stability / Monitoring | ✅ | ❌ | Missing production telemetry and parity configurations. | P0 |

---

## The Verdict

Can the user complete the end-to-end journey today?
**NO.**

The journey breaks at **Payment (Webhook verification)** and **Candidate Exam UX (State persistence/Auto-save)**. These must be the absolute focus of the team.
