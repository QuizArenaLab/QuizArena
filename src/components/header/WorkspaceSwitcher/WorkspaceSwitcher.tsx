"use client";

import React from "react";
import { WorkspaceSwitcherProps } from "./WorkspaceSwitcher.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { useHeaderResponsive } from "@/providers/HeaderProvider";

export function WorkspaceSwitcher({
  workspaceName = "Select Workspace",
  workspaceDescription,
  workspaceIcon = "Building",
  className = "",
}: WorkspaceSwitcherProps) {
  const { isCompact } = useHeaderResponsive();

  return (
    <button
      className={`flex items-center gap-2 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200 ${className}`}
      aria-haspopup="true"
      aria-expanded="false"
      aria-label="Workspace Switcher"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary shrink-0">
        <Icon name={workspaceIcon} className="w-4 h-4" />
      </div>

      {!isCompact && (
        <div className="flex flex-col items-start text-left max-w-[160px]">
          <span className="text-sm font-semibold text-navy truncate w-full leading-tight">
            {workspaceName}
          </span>
          {workspaceDescription && (
            <span className="text-[10px] text-gray-500 truncate w-full leading-tight">
              {workspaceDescription}
            </span>
          )}
        </div>
      )}

      {!isCompact && <Icon name="ChevronDown" className="w-4 h-4 text-gray-400 shrink-0 ml-1" />}
    </button>
  );
}

ComponentRegistry.register({
  id: "workspace-switcher",
  name: "WorkspaceSwitcher",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
