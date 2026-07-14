# QA Review — Capability Sprint 03

**Role:** QA Engineer
**Feature:** Competition Enrollment & Access Control

## Checks Evaluated

**1. Free vs Paid Logic:**
- If an admin sets `entryFee = 0`, the backend creates a `PricingPolicy` with `baseFee = 0` and `type = FREE`. 
- When a user clicks "Enroll for Free", the `registration.service.ts` instantly returns an `ENROLLED` status and increments the participant counter without touching Razorpay.

**2. Participant Limits:**
- The system correctly counts existing `Registration` rows and blocks new registrations if the count is `>= maxParticipants`.

**3. State Management in UI:**
- The Learner UI appropriately reads the `enrollmentStatus`. It dynamically changes the call-to-action button based on state: "Enroll for Free" vs "Complete Payment" vs "Enter Arena" vs "Capacity Full".

**4. Admin Config Sync:**
- The `management.repository.ts` effectively deactivates old `PricingPolicy` rows and creates a new one every time the admin saves changes to the Economics tab. This ensures the learner always gets billed the most up-to-date fee.

**Verdict:** PASS
