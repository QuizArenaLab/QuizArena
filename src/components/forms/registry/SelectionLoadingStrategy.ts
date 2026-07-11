export type SelectionLoadingStrategyType = "static" | "lazy" | "remote" | "infinite";

export interface SelectionLoadingStrategy {
  type: SelectionLoadingStrategyType;
  // Further architecture can be defined here for loading state handling
}
