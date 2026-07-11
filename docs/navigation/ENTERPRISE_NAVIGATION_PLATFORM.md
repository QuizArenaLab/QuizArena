# Enterprise Navigation Platform

**Version:** 1.0.0
**Status:** Frozen

The Navigation Platform is the strict layout and routing manifest engine for all workspaces in QuizArena. It provides deterministic layout rendering driven entirely by immutable data structures rather than tightly coupled routing logic.

## Core Concepts

### 1. Registry-Driven Architecture
Workspaces do not construct sidebars directly. Instead, they register metadata into the `NavigationRegistry`. The registry resolves the final navigation tree securely via permission checks.

### 2. State Encapsulation
The platform uses fine-grained React Contexts in `NavigationProvider`:
- **NavigationTreeContext**: Controls nested accordion expansion.
- **NavigationSelectionContext**: Tracks the active navigation item.
- **NavigationCollapseContext**: Controls sidebar collapsing / drawing logic.
- **NavigationHoverContext**: (Reserved for future hover popovers/tooltips).
This prevents global re-renders.

### 3. Events Architecture
The `NavigationEventBus` (in `NavigationEvents.ts`) emits purely analytical and side-effect events:
- `ItemSelected`
- `GroupExpanded` / `GroupCollapsed`
- `SidebarCollapsed` / `SidebarExpanded`
Analytics logic can subscribe without modifying component rendering.

### 4. Animation Guardrails
All `framer-motion` presence and transition logic is strictly isolated in `NavigationCollapse.tsx`. Workspaces and internal components (like `NavigationGroup`) consume wrapper transition components, enforcing deterministic animations.

### 5. Directionality
The platform formally supports `RTL` and `LTR` rendering via the `NavigationDirection` type, automatically inverting transitions and positioning where required.

## API Contracts
Refer to `NavigationManifest.ts` for the exact shape of registered items. Important structural options include:
- `group`: Maps items to logical headers.
- `parent`: Defines tree hierarchy.
- `badge`: Supports custom counters, statuses, and thematic colors.
- `permissions`: Strict RBAC evaluations integrated with `NavigationPermissions`.
