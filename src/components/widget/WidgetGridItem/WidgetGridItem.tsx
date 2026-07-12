import React from "react";
import { useWidget, WidgetContext } from "../../../widget";

export interface WidgetGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  manifest?: any; // To allow usage in playgrounds without context
}

export const WidgetGridItem: React.FC<WidgetGridItemProps> = ({
  children,
  className = "",
  manifest: propManifest,
  ...props
}) => {
  // Use context if available, otherwise fallback to prop
  const context = React.useContext(WidgetContext);
  const manifest = propManifest || context?.manifest;
  const isFullscreen = context?.isFullscreen || false;

  if (!manifest) return null;

  const { defaultColumns, defaultRows, minHeight } = manifest.layout;

  // Inline styles for CSS grid spans based on manifest layout
  const gridStyle = {
    gridColumn: `span ${defaultColumns}`,
    gridRow: `span ${defaultRows}`,
    minHeight: minHeight,
  };

  if (isFullscreen) {
    // If fullscreen, the actual item might be hidden or act as a placeholder
    return (
      <div style={gridStyle} className={`opacity-0 pointer-events-none ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div style={gridStyle} className={`flex flex-col ${className}`} {...props}>
      {children}
    </div>
  );
};
