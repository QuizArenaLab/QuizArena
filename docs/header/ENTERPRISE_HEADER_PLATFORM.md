# Enterprise Topbar & Workspace Header Platform

**Version:** 1.0.0
**Status:** Frozen

The Enterprise Header Platform establishes a unified, presentation-only, registry-driven architecture for all top-level headers across QuizArena workspaces.

## Architecture

The platform separates state, registry, events, and UI components into a consistent pattern:

- **Manifest & Registry**: Immutable data structures defined in `HeaderManifest.ts` dictate the capabilities and features available to a given header (e.g., `supportsActions`, `supportsProfile`). `HeaderRegistry.ts` manages the availability and resolution of these manifests.
- **Capabilities**: `HeaderCapabilities.ts` breaks down functional boolean flags to govern what the UI should render.
- **Context & State**: `HeaderProvider.tsx` manages three fine-grained contexts:
  - `HeaderPresentationContext` (title, subtitle)
  - `HeaderActionsContext` (primary, secondary, overflow nodes)
  - `HeaderResponsiveContext` (compact mode toggling)
- **Events**: `HeaderEvents.ts` declares typed events like `ActionClicked` or `WorkspaceSwitcherOpened`. Note: No actual event dispatcher is implemented in the platform itself; this is deferred to an Analytics layer.

## Components

All components are strictly presentation-focused and register themselves in the `ComponentRegistry`.

- `Topbar`: Structural framing and safe spacing.
- `WorkspaceHeader`: Core flex layout composer.
- `WorkspaceTitle` & `WorkspaceSubtitle`: Typography and truncation rules.
- `HeaderActions`: Slot management for primary/secondary buttons.
- `GlobalActionArea`: Grouping container for icons and global features.
- `UserProfileMenu`: Presentation-only profile trigger. **No auth or logout logic.**
- `WorkspaceSwitcher`: Presentation-only selector placeholder.
- `NotificationBell`: Badge and empty-state handling. **No websocket or polling logic.**

## Theming & Accessibility

- All colors, sizing, and spacing are driven by Theme Tokens (Tailwind utility classes mapping to tokens).
- `<header role="banner">` is enforced, along with proper `aria-label`, `aria-haspopup`, and `aria-expanded` attributes for accessibility (WCAG 2.2 AA).
- RTL (`direction: rtl`) is fully supported and gracefully reflows flexbox layouts.
