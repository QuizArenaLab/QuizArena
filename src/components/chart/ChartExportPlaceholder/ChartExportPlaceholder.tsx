import React from "react";

export type ChartExportPlaceholderFormat = "Download" | "Image" | "CSV" | "PDF" | "disabled";

export interface ChartExportPlaceholderProps {
  formats?: ChartExportPlaceholderFormat[];
  className?: string;
}

/**
 * Presentation-only slot for Export capabilities in a chart.
 */
export const ChartExportPlaceholder: React.FC<ChartExportPlaceholderProps> = ({
  formats = ["Download"],
  className = "",
}) => {
  return null; // Presentation slot only
};
