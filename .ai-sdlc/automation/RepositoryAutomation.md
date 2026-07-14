# Repository Automation

Defines artifact storage, documentation updates, manifest updates, version updates, repository synchronization, and archive policy.

## Rules
- **Artifact Storage:** Artifacts must be stored only in the `.ai-sdlc/active/` directory.
- **Archive Policy:** Sprint artifacts are never archived directly. Release archives (`archive/releases/`) are created only for milestone releases.
