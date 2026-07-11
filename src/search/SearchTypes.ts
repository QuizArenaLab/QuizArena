import { ReactNode } from "react";

export type SearchInputState = "Idle" | "Focused" | "Loading" | "Disabled" | "Error" | "Success";
export type FilterChipState =
  | "selected"
  | "disabled"
  | "removable"
  | "icon"
  | "counter"
  | "favorite";
export type FilterGroupState = "expanded" | "collapsed" | "disabled" | "description";
export type SavedFilterState = "favorite" | "shared" | "recent" | "locked";
export type SearchEmptyStateType =
  | "No Search Yet"
  | "No Results"
  | "Loading"
  | "Offline"
  | "Permission Restricted";

export interface FilterChipModel {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
  counter?: number;
  states?: FilterChipState[];
}

export interface AdvancedFilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface AdvancedFilterGroupModel {
  id: string;
  connector: "AND" | "OR";
  rules: (AdvancedFilterRule | AdvancedFilterGroupModel)[];
}
