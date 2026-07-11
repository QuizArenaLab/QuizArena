"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { NavigationTreeProps } from "./NavigationTree.types";
import { NavigationGroup } from "../NavigationGroup";
import { NavigationItem } from "../NavigationItem";
import {
  useNavigationTree,
  useNavigationSelection,
  useNavigationHover,
  useNavigationCollapse,
} from "@/providers/NavigationProvider";
import { NavigationTreeNode } from "@/navigation/NavigationTreeNode";
import { NavigationEventBus } from "@/navigation";

export const NavigationTree: React.FC<NavigationTreeProps> = ({
  groups,
  currentRoute,
  className = "",
}) => {
  const { expandedGroups, toggleGroup } = useNavigationTree();
  const { selectedId, setSelectedId } = useNavigationSelection();
  const { hoveredId, setHoveredId } = useNavigationHover();
  const { collapsed } = useNavigationCollapse();

  const renderNode = (node: NavigationTreeNode, depth: number = 0) => {
    const isExpanded = expandedGroups.includes(node.manifest.id);
    const isActive = selectedId === node.manifest.id || currentRoute === node.manifest.route;
    const isHovered = hoveredId === node.manifest.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.manifest.id} className="relative">
        <NavigationItem
          id={node.manifest.id}
          title={node.manifest.title}
          route={node.manifest.route}
          icon={node.manifest.icon}
          activeIcon={node.manifest.activeIcon}
          active={isActive}
          disabled={node.manifest.status === "deprecated"}
          badge={node.manifest.badge}
          hasChildren={hasChildren}
          collapsed={collapsed}
          onMouseEnter={() => setHoveredId(node.manifest.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => {
            if (hasChildren) {
              toggleGroup(node.manifest.id);
            } else {
              setSelectedId(node.manifest.id);
              NavigationEventBus.dispatch("ItemSelected", {
                id: node.manifest.id,
                route: node.manifest.route,
              });
            }
          }}
        />
        {hasChildren && isExpanded && !collapsed && (
          <div className="pl-4 ml-2 border-l border-gray-100 mt-1 space-y-1">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div role="tree" className={`flex flex-col gap-2 ${className}`}>
      {groups.map((group) => {
        const isGroupExpanded = expandedGroups.includes(group.id) || group.defaultExpanded;
        return (
          <NavigationGroup
            key={group.id}
            id={group.id}
            title={group.title}
            description={group.description}
            icon={group.icon}
            expanded={isGroupExpanded}
            collapsed={collapsed}
            onToggle={() => toggleGroup(group.id)}
          >
            {group.nodes.map((node) => renderNode(node))}
          </NavigationGroup>
        );
      })}
    </div>
  );
};

ComponentRegistry.register({
  id: "nav-tree",
  name: "NavigationTree",
  category: "navigation",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
