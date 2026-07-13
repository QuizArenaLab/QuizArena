# Retry & Recovery

Defines retry rules, max retries, re-review, failure escalation, rollback, and restart procedures.

## Rules
- **Worker Recovery:** If a worker encounters a transient error, the engine may attempt a restart up to a defined limit.
- **Timeout Escalations:** If recovery exceeds the SLA, the issue is escalated to the Engineering Manager.
- **Rollback:** In unrecoverable states, the automation may rollback to the last known `APPROVED` state.
