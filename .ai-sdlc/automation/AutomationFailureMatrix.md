# Automation Failure Matrix

Maps failures to the responsible worker, defining recovery, retry, and escalation paths.

- **Routing Rule:** Failures return to the worker responsible for correcting them.
  - *Example:* Architecture FAIL -> Implementation Engineer -> Evidence Engineer -> Architecture Reviewer.
  - *Example:* QA FAIL -> Implementation Engineer -> Evidence Engineer -> Architecture Reviewer -> QA.
  - *Example:* Documentation FAIL -> Documentation Engineer -> Repository Automation.
- **Engineering Manager Intervention:** The Engineering Manager only intervenes for:
  - Workflow deadlocks
  - Missing artifacts
  - Invalid sprint state
  - Worker timeout
  - Manual override
  - Sprint cancellation

The Engineering Manager acts as an orchestrator, not a repair technician.
