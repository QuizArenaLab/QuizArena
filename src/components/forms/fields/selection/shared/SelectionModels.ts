import { ReactNode } from "react";

export interface SelectionOptionModel {
  id: string;
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  group?: string;
  metadata?: Record<string, unknown>;
}

export type SelectionEmptyState =
  | "NoResults"
  | "Loading"
  | "PermissionDenied"
  | "NetworkError"
  | "NoData";

export type SelectionDataSourceStrategy = "Static" | "Async" | "Remote" | "Cached";

export type SelectionSearchStrategy = "Fuzzy" | "Contains" | "StartsWith" | "Exact";

export type SelectionGroupType = "Standard" | "Countries" | "States" | "Cities";

export type MultiSelectCategory = "PinnedItems" | "Recent" | "Favorites" | "Suggested";

export interface SelectionDataSource {
  strategy: SelectionDataSourceStrategy;
  endpoint?: string;
  cacheKey?: string;
  ttl?: number;
}
