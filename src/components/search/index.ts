import { ComponentRegistry } from "../../registry";

export * from "./SearchInput";
export * from "./GlobalSearchBar";
export * from "./FilterBar";
export * from "./FilterGroup";
export * from "./FilterChip";
export * from "./FilterPanel";
export * from "./AdvancedFilterBuilder";
export * from "./SavedFilter";
export * from "./SearchEmptyState";

// Register Search & Filter Components
const searchComponents = [
  {
    id: "search-input",
    name: "SearchInput",
    description: "Base search input field with states.",
  },
  {
    id: "global-search-bar",
    name: "GlobalSearchBar",
    description: "Advanced global search bar.",
  },
  {
    id: "filter-bar",
    name: "FilterBar",
    description: "Horizontal container for filter chips and groups.",
  },
  {
    id: "filter-group",
    name: "FilterGroup",
    description: "Expandable container for related filters.",
  },
  {
    id: "filter-chip",
    name: "FilterChip",
    description: "Interactive removable filter token.",
  },
  {
    id: "filter-panel",
    name: "FilterPanel",
    description: "Popover/Dialog container for complex filtering.",
  },
  {
    id: "advanced-filter-builder",
    name: "AdvancedFilterBuilder",
    description: "Visual rule builder for complex queries.",
  },
  {
    id: "saved-filter",
    name: "SavedFilter",
    description: "UI representation of a saved search preset.",
  },
  {
    id: "search-empty-state",
    name: "SearchEmptyState",
    description: "Empty state UI for various search conditions.",
  },
];

searchComponents.forEach((comp) => {
  ComponentRegistry.register({
    ...comp,
    category: "search",
    version: "1.0.0",
    status: "stable",
    owner: "UI Component Library Engineer",
  });
});
