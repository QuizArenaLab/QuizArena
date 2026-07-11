"use client";

import React from "react";
import { UserProfileMenuProps } from "./UserProfileMenu.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { useHeaderResponsive } from "@/providers/HeaderProvider";

export function UserProfileMenu({
  avatarUrl,
  displayName = "User",
  role,
  organization,
  className = "",
}: UserProfileMenuProps) {
  const { isCompact } = useHeaderResponsive();

  return (
    <button
      className={`flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full transition-colors cursor-pointer ${className}`}
      aria-haspopup="true"
      aria-expanded="false"
      aria-label="User Profile Menu"
    >
      <div className="relative flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
        ) : (
          <Icon name="User" className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {!isCompact && (
        <div className="flex flex-col items-start text-left max-w-[120px]">
          <span className="text-sm font-medium text-navy truncate w-full leading-tight">
            {displayName}
          </span>
          {(role || organization) && (
            <span className="text-[10px] text-gray-500 truncate w-full leading-tight">
              {role} {role && organization ? "•" : ""} {organization}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

ComponentRegistry.register({
  id: "user-profile-menu",
  name: "UserProfileMenu",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
