export interface DashboardGridDefinition {
  columns: number;
  gap: number;
  rowHeight: number | "auto";
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}
