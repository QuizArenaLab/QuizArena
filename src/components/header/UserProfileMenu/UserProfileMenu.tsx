"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserProfileMenuProps } from "./UserProfileMenu.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { useHeaderResponsive } from "@/providers/HeaderProvider";
import { PopoverRoot, PopoverTrigger, PopoverContent } from "@/components/primitives/Popover";

export function UserProfileMenu({
  avatarUrl,
  displayName = "User",
  role,
  organization,
  className = "",
}: UserProfileMenuProps) {
  const { isCompact } = useHeaderResponsive();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <button
          className={`flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full transition-colors cursor-pointer ${className}`}
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="User Profile Menu"
        >
          <div className="relative flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={32}
                height={32}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon name="User" className="w-4 h-4 text-gray-500" />
            )}
          </div>

          {!isCompact && (
            <div className="flex flex-col items-start text-left max-w-30">
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
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-56 p-1">
        <div className="flex flex-col space-y-1">
          <Link
            href="/profile"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center"
          >
            <Icon name="User" className="w-4 h-4 mr-2 text-gray-500" />
            My Profile
          </Link>
          <Link
            href="/settings"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center"
          >
            <Icon name="Settings" className="w-4 h-4 mr-2 text-gray-500" />
            Settings
          </Link>

          <div className="h-px bg-gray-200 my-1 mx-2" />

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin mr-2" />
            ) : (
              <Icon name="LogOut" className="w-4 h-4 mr-2 text-red-500" />
            )}
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </PopoverContent>
    </PopoverRoot>
  );
}

ComponentRegistry.register({
  id: "user-profile-menu",
  name: "UserProfileMenu",
  category: "header",
  version: "1.1.0",
  status: "stable",
  owner: "workspace-architecture",
});
