# Worker Orchestration

Defines the worker lifecycle, eligibility, activation, completion, handoff, dependencies, and isolation.

## Worker Lifecycle States
Every worker operates within a strict lifecycle.
- `IDLE`: The worker is inactive.
- `READY`: All preconditions and dependencies are met.
- `RUNNING`: The worker is actively processing its task.
- `WAITING`: The worker is paused, awaiting an external dependency or event.
- `BLOCKED`: The worker cannot proceed due to a missing hard dependency or failure.
- `COMPLETED`: The worker has successfully satisfied its postconditions.
- `FAILED`: The worker encountered a failure condition.

## Timeout Rules
- If a worker remains in `READY` for `>24h`, its state becomes `STALE`.
- `STALE` state triggers an immediate notification to the Engineering Manager.
