# Workspace Layout Architecture

**Version: 1.0.0 (Frozen)**

## Overview
The Workspace Layout Foundation is the permanent structural layer inherited by every QuizArena workspace. It enforces consistency, strict responsive handling, decoupled slot orchestration, and accessibility landmarks across the platform.

No workspace may create its own layout. All workspaces must compose the predefined slot components inside the `WorkspaceLayout`.

## Folder Structure
```text
src/layouts/workspace/
├── AppShell/                  # Handles Viewport, SafeArea, Theme
├── WorkspaceLayout/           # Slot-based layout composition matrix
├── WorkspaceContainer/        # Container handling max-widths
├── WorkspaceContent/          # Main wrapper
├── WorkspaceBody/             # Flex wrapper for main content and aside
├── WorkspaceMain/             # Semantic <main> element
├── WorkspaceAside/            # Semantic <aside> element
├── WorkspaceFooter/           # Semantic <footer> element
├── [Navigation, Header, Toolbar, Content, Aside, Footer]Slot/ # Dedicated Slot APIs
├── ResponsiveBreakpoint.ts    # Centralized responsive enums
├── WorkspaceManifest.ts       # Layout capabilities declaration
├── WorkspaceRegistry.ts       # Registry validating layout configurations
└── index.ts                   # Centralized exports
```

## Key Architectural Principles

1. **Strict Decoupling via Slots**
   Layouts do not implement `Sidebar`, `Header`, or any business domain components directly. Instead, they expose strictly typed slots: `<NavigationSlot>`, `<HeaderSlot>`, `<ContentSlot>`, etc.

2. **Component Registration**
   Every layout structural component (e.g., `WorkspaceMain`, `AppShell`) must register itself in the global `ComponentRegistry`.

3. **Workspace Registry Validation**
   `WorkspaceRegistry` tracks layout implementations and strictly validates against duplicate slots, unknown slots, and missing manifest requirements via `.validate()`.

4. **Pure Theming**
   Structural components only consume `cn()` classes mapping directly to `@/theme` tokens. There are no hardcoded colors, spacing, or typography.

5. **Responsive State Centralization**
   Responsive breakpoints (`Desktop`, `Laptop`, `Tablet`, `Mobile`, `SmallMobile`) are centrally managed via the `WorkspaceLayoutState` in the `WorkspaceProvider`.

## Example Implementation
```tsx
import { AppShell, WorkspaceLayout, HeaderSlot, ContentSlot, AsideSlot } from "@/layouts/workspace";

export function CustomWorkspace() {
  return (
    <AppShell>
      <WorkspaceLayout>
        <HeaderSlot>
          <MyHeader />
        </HeaderSlot>
        <ContentSlot>
          <MyContent />
        </ContentSlot>
        <AsideSlot>
          <MySidebar />
        </AsideSlot>
      </WorkspaceLayout>
    </AppShell>
  );
}
```

## Freezing
This document, alongside the `src/layouts/workspace/` implementation, is considered **Version 1.0.0** and is frozen. Any changes must undergo strict Frontend Guardian Architectural Review.
