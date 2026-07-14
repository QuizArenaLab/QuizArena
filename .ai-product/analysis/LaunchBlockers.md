# Launch Blockers

The following items are absolute P0 Launch Blockers. If these are not resolved, QuizArena v1.0 CANNOT launch.

## 1. Competition Platform API Wiring
- **Issue**: The robust DDD architecture in `src/competitions/` is disconnected from the Next.js frontend. Administrators cannot currently configure or publish competitions via the UI.
- **Impact**: Cannot conduct a competition.
- **Remediation**: Create Next.js API routes or Server Actions in `src/app/api/competitions` to expose `CompetitionOperationsService`.

## 2. Commerce Platform Webhook Validation
- **Issue**: The `RevenueGateway` and `RazorpayAdapter` exist, but the strict end-to-end flow ensuring users only gain access to a competition *after* successful Razorpay webhook verification is incomplete.
- **Impact**: Cannot accept payment securely, leading to financial loss or locked-out users.
- **Remediation**: Finalize `WebhookProcessor` and map successful transaction states to user competition entitlements.

## 3. Assessment UI Data Binding
- **Issue**: The backend models (`SubmissionResult`) exist, but the frontend Candidate Assessment UI (`src/app/(candidate)`) is not fully persisting state back to the server in real-time.
- **Impact**: Loss of candidate exam data if the browser crashes.
- **Remediation**: Implement auto-save intervals and connect the Candidate UI directly to the `SubmissionResult` API.

## 4. Production Environment Configuration
- **Issue**: Missing staging and production parity configurations, including critical monitoring hooks.
- **Impact**: Platform instability under launch load.
- **Remediation**: Finalize `.env.production` mappings and deploy basic telemetry.
