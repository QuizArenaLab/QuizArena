import React from "react";
import { useWidget } from "../../../widget";
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";

export interface WidgetHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, subtitle, icon, children }) => {
  const { manifest, isCollapsed, isFullscreen, toggleCollapse, toggleFullscreen } = useWidget();
  const displayTitle = title || manifest.metadata.name;
  const displaySubtitle = subtitle || manifest.metadata.description;

  return (
    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
      <div className="flex items-center gap-3 overflow-hidden">
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
        <div className="flex flex-col truncate">
          <h3 className="text-sm font-semibold text-slate-900 truncate">{displayTitle}</h3>
          {displaySubtitle && <p className="text-xs text-slate-500 truncate">{displaySubtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {children}
        {manifest.layout.allowCollapse && (
          <button
            onClick={toggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={isCollapsed ? "Expand widget" : "Collapse widget"}
            title={isCollapsed ? "Expand widget" : "Collapse widget"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        )}
        {manifest.layout.allowFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
