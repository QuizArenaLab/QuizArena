/**
 * Defines the structural layout and positioning for a chart and its slots.
 */
export interface ChartLayout {
  titlePosition?: "top" | "bottom" | "left" | "right" | "none";
  legendPosition?: "top" | "bottom" | "left" | "right" | "none";
  toolbarPosition?: "top" | "bottom" | "none";
  footerPosition?: "top" | "bottom" | "none";
  padding?: number | string | { top?: number; right?: number; bottom?: number; left?: number };
  aspectRatio?: number;
}
