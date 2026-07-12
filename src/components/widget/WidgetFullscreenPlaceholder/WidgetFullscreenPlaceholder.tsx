import React from "react";
import { useWidget } from "../../../widget";
import { createPortal } from "react-dom";

export interface WidgetFullscreenPlaceholderProps {
  children: React.ReactNode;
}

export const WidgetFullscreenPlaceholder: React.FC<WidgetFullscreenPlaceholderProps> = ({
  children,
}) => {
  const { isFullscreen } = useWidget();

  if (!isFullscreen) return <>{children}</>;

  // When fullscreen, we render the widget inside a portal overlay
  const overlay = (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full h-full max-w-7xl mx-auto flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );

  // Note: Needs a div with id="portal-root" in layout for createPortal if used properly,
  // but for presentation, document.body works when mounted
  if (typeof document !== "undefined") {
    return createPortal(overlay, document.body);
  }

  return null;
};
