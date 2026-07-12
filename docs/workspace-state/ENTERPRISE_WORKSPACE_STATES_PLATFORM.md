# Enterprise Workspace States Platform

**Version:** 1.0.0
**Status:** Frozen

The Enterprise Workspace States Platform provides a presentation-only, registry-driven foundation for all non-happy path visual states across QuizArena workspaces. 

## Architecture

This platform guarantees that every workspace behaves consistently during loading, empty, error, offline, maintenance, and permission scenarios. 

- **Manifest & Registry**: Immutable data structures defined in `WorkspaceStateManifest.ts` dictate the capabilities and features available. `WorkspaceStateRegistry.ts` acts as the source of truth.
- **Provider**: `WorkspaceStateProvider.tsx` acts as a pure presentation layer context. **It does not perform data fetching, API retries, routing, or authentication checks.**
- **Delegation Pattern**: The `WorkspaceState` master component serves as the singular public renderer. All future business workspaces should render `<WorkspaceState state={activeState} />` rather than manually importing disjointed Error, Empty, or Loading components.

## Sub-Components

- `EmptyState`: Supports No Data, No Results, First Time, Search Empty, Filter Empty, Workspace Empty, Coming Soon, Archived.
- `LoadingState`: Supports Spinner, Skeleton, Card, Table, Dashboard, Fullscreen, Inline.
- `ErrorState`: Supports Generic, Network, Unknown, Workspace, Permission Placeholder.
- `OfflineState`: Displays offline warnings with a custom placeholder action.
- `PermissionState`: Supports Restricted, Read Only, Hidden, Unavailable.
- `MaintenanceState`: Supports Scheduled, Temporary, Read Only, Upgrade.
- `SkeletonLayout`: Built securely on top of the foundational `Skeleton` primitive, offering Dashboard, Table, Form, Card, Sidebar, and Header variants.

## Theming & Accessibility

- Exclusively consumes standard Tailwind primitives and Theme Tokens (`bg-red-50`, `text-navy`, etc.).
- Out of the box WCAG 2.2 AA compliant with `role="status"`, `role="alert"`, `aria-busy`, and `aria-live="polite"` tags.
- Fully responsive across desktop, tablet, and mobile, governed by `compactMode` and `fullscreen` provider flags.

## Workspace Platform Freeze

With the completion of FS-02.7, the entire **Workspace Platform** is formally frozen at **v1.0.0**. 

This includes:
- FS-02.1 Workspace Layout Foundation
- FS-02.2 Enterprise Navigation Platform
- FS-02.3 Enterprise Header Platform
- FS-02.4 Enterprise Breadcrumb Platform
- FS-02.5 Enterprise Search & Filter Platform
- FS-02.6 Enterprise Toolbar & Command Platform
- FS-02.7 Enterprise Workspace States Platform

All higher-level domains and workspaces must consume these platforms. No further architectural mutations are permitted to the Workspace Platform shell without formal architectural board approval.
