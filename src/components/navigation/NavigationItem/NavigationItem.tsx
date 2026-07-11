"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/icons/Icon";
import { NavigationItemProps } from "./NavigationItem.types";
import { ComponentRegistry } from "@/registry";

export const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  (
    {
      id,
      title,
      route,
      icon,
      activeIcon,
      active,
      disabled,
      external,
      badge,
      favorite,
      recent,
      hasChildren,
      collapsed,
      onClick,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    const isExternal = external || route.startsWith("http");
    const Component = isExternal ? "a" : Link;

    const baseClasses = `group relative flex items-center gap-3 py-3 min-h-[48px] rounded-xl transition-all duration-200 cursor-pointer ${
      collapsed ? "justify-center px-0 mx-2" : "px-4"
    }`;

    const stateClasses = disabled
      ? "opacity-50 cursor-not-allowed text-gray-400"
      : active
        ? "bg-orange-50 text-orange-600 shadow-[inset_0_2px_12px_rgba(249,115,22,0.06)]"
        : "text-gray-600 hover:bg-gray-50 hover:text-navy";

    const content = (
      <>
        {active && !collapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
        )}

        {(icon || activeIcon) && (
          <span className="flex-shrink-0">
            <Icon name={(active && activeIcon ? activeIcon : icon) as any} size={18} className={active ? "text-primary" : "text-gray-500"} />
          </span>
        )}

        {!collapsed && (
          <span className={`text-sm truncate flex-1 ${active ? "font-semibold" : "font-medium"}`}>
            {title}
          </span>
        )}

        {!collapsed && (
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {recent && <Icon name="Clock" className="w-3 h-3 text-gray-400" aria-label="Recent" />}
            {favorite && (
              <Icon
                name="Star"
                className="w-3 h-3 text-amber-400 fill-amber-400"
                aria-label="Favorite"
              />
            )}
            {badge && (
              <div
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ml-auto ${badge.status === "error" ? "bg-red-500 text-white" : "bg-primary/10 text-primary"}`}
                style={badge.color ? { backgroundColor: badge.color, color: "#fff" } : undefined}
              >
                {badge.count !== undefined ? badge.count : badge.label}
              </div>
            )}
            {hasChildren && (
              <Icon
                name="ChevronRight"
                className="w-4 h-4 text-gray-400 ml-1 opacity-50 group-hover:opacity-100 transition-opacity"
              />
            )}
            {isExternal && <Icon name="ExternalLink" className="w-3.5 h-3.5 text-gray-400 ml-1" />}
          </div>
        )}
      </>
    );

    if (disabled) {
      return (
        <div
          role="treeitem"
          aria-selected={active}
          aria-disabled="true"
          className={`${baseClasses} ${stateClasses}`}
          title={collapsed ? title : undefined}
        >
          {content}
        </div>
      );
    }

    return (
      <Component
        ref={ref}
        href={route}
        role="treeitem"
        aria-selected={active}
        className={`${baseClasses} ${stateClasses}`}
        title={collapsed ? title : undefined}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Component>
    );
  }
);
NavigationItem.displayName = "NavigationItem";

ComponentRegistry.register({
  id: "nav-item",
  name: "NavigationItem",
  category: "navigation",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
