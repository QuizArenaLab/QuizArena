"use client";

import React from "react";
import { Icon } from "@/icons/Icon";
import { NavigationGroupProps } from "./NavigationGroup.types";
import { ComponentRegistry } from "@/registry";
import { NavigationAccordionTransition } from "../NavigationCollapse/NavigationCollapse";

export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  id,
  title,
  description,
  icon,
  expanded = true,
  collapsed = false,
  onToggle,
  children,
}) => {
  if (collapsed) {
    // When sidebar is collapsed, we generally don't show group headers unless they are icons
    // But since groups represent logical sections, we might just render a divider or nothing.
    // Let's render a simple divider
    return <div role="group" aria-label={title} className="my-2 border-t border-gray-100 mx-4" />;
  }

  return (
    <div role="group" aria-label={title} className="mb-2">
      {title && (
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-4 py-2 group cursor-pointer hover:bg-gray-50/50 transition-colors rounded-xl mx-2 w-[calc(100%-1rem)]"
          aria-expanded={expanded}
          aria-controls={`group-${id}`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {icon && (
              <Icon
                name={icon}
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0"
              />
            )}
            <div className="flex flex-col items-start truncate text-left">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase group-hover:text-gray-600 transition-colors truncate w-full">
                {title}
              </span>
              {description && (
                <span className="text-[10px] text-gray-400 truncate w-full">{description}</span>
              )}
            </div>
          </div>
          {onToggle && (
            <Icon
              name="ChevronDown"
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                expanded ? "" : "-rotate-90"
              }`}
            />
          )}
        </button>
      )}

      <NavigationAccordionTransition expanded={expanded || !title} id={`group-${id}`}>
        {children}
      </NavigationAccordionTransition>
    </div>
  );
};

ComponentRegistry.register({
  id: "nav-group",
  name: "NavigationGroup",
  category: "navigation",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
