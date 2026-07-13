# Automation Engine Versioning

Defines the compatibility matrix for the Automation Engine to prevent silent drift between governance components.

## Current Version
- **Automation Engine Version:** 1.0.0

## Compatibility Matrix
The Automation Engine (v1.0.0) is officially compatible with the following component versions:

- **Compatible Constitution:** 1.0.0
- **Compatible Standards:** 1.0.0
- **Compatible Workers:** 1.0.0
- **Compatible Workflow:** 1.0.0
- **Compatible Checklists:** 1.0.0

If any underlying governance component (e.g., Constitution) upgrades to a newer major version without a corresponding Automation upgrade, it is considered an incompatible drift and execution should halt until the matrices are realigned.
