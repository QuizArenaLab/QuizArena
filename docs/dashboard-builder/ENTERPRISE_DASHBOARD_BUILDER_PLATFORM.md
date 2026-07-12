# Enterprise Dashboard Builder Platform

**Version:** 1.0.0
**Status:** Frozen

The **Enterprise Dashboard Builder Platform** is a highly reusable composition engine that sits above the Dashboard Foundation, Chart Library, KPI Library, and Widget Library. Its sole responsibility is structurally assembling Widgets into consistent, responsive, and theme-compliant Dashboard Layouts.

## Strict Separation of Concerns

> [!CAUTION]
> The Dashboard Builder Platform guarantees a strict separation of concerns. It is **strictly presentation-focused**.
> 
> **It absolutely will NOT contain:**
> - Business logic or API requests.
> - Drag-and-drop implementations (placeholders emit callbacks only).
> - Persistence (no LocalStorage or API saving; it will expose an `onLayoutChange` callback).
> - KPI or Analytics calculations.
> - Dashboard routing or app state management.

## Architecture

The platform architecture is structured into the following layers:

### 1. Registries & Layout Definitions
- **DashboardBuilderRegistry**: Maintains metadata about builder capabilities (modes, responsiveness).
- **DashboardTemplateRegistry**: Exposes immutable Layout Definitions. Templates (e.g. `ExecutiveLayout`, `AnalyticsLayout`) are **not** React components. They are declarative configurations (`DashboardLayoutDefinition`) containing `DashboardGridDefinition` and `DashboardZoneDefinition`.

### 2. Presentation Orchestration
- **DashboardBuilderContext**: `DashboardBuilderProvider` tracks modes (`VIEW`, `EDIT`, `PREVIEW`, `LOCKED`), active grids, and hover/selection states. 
- **DashboardBuilder**: The top-level composition engine combining all sub-components.
- **DashboardCanvas & DashboardGrid**: Map the Layout Definitions to CSS grid rules and responsive breakpoints.

### 3. Rendering Boundary
- **DashboardZone**: Groupings for related widget slots.
- **WidgetSlot**: A position within the CSS Grid. If empty and in edit mode, it automatically displays a `WorkspacePlaceholder`.
- **WidgetHost**: The **only** rendering boundary that interacts with widgets. Widgets are always wrapped in a `WidgetHost`.
  - `WidgetSlot` -> `WidgetHost` -> `[Any Business Widget]`.

### 4. Interactive Placeholders
All interactive layout management elements (Move, Resize, Reorder, Selection) are presentational shells. They emit typed callbacks (`onMoveStart`, `onResizeStart`) without attempting to manage bounding boxes, coordinates, or drag states natively.

## Implementation Guide

To consume this platform in a business workspace:

```tsx
<DashboardBuilderProvider defaultMode="VIEW">
  <DashboardBuilderToolbar 
    onSave={() => persistChanges()} 
    onCancel={() => discardChanges()} 
  />
  <DashboardBuilder layout={MySelectedTemplateDefinition}>
    <DashboardZone id="hero-zone">
      <WidgetSlot id="slot-1" colSpan={4}>
        <WidgetHost id="kpi-widget-id">
          <MyKPIWidget />
        </WidgetHost>
      </WidgetSlot>
    </DashboardZone>
  </DashboardBuilder>
</DashboardBuilderProvider>
```

By decoupling the layout presentation engine from the business data, the entire QuizArena application can dynamically generate complex dashboards without duplicating grid systems, edit overlays, or widget boundaries.
