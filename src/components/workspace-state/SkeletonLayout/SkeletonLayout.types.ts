export type SkeletonLayoutVariant =
  | "dashboard"
  | "table"
  | "form"
  | "card"
  | "sidebar"
  | "header"
  | "custom";

export interface SkeletonLayoutProps {
  variant?: SkeletonLayoutVariant;
  rows?: number; // Used mainly for table variant
  className?: string;
}
