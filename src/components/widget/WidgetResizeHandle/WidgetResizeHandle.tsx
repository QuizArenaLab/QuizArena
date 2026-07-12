import React from "react";
import { useWidget } from "../../../widget";
import { GripHorizontal } from "lucide-react";

export const WidgetResizeHandle: React.FC = () => {
  const { manifest, isCollapsed } = useWidget();

  if (isCollapsed || !manifest.layout.allowResize) return null;

  return (
    <div className="absolute bottom-0 right-0 p-1 cursor-nwse-resize text-slate-300 hover:text-slate-500 transition-colors z-10">
      <GripHorizontal className="w-3 h-3 rotate-45" />
    </div>
  );
};
