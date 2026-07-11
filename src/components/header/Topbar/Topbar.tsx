"use client";

import React from "react";
import { TopbarProps } from "./Topbar.types";
import { ComponentRegistry } from "@/registry";
import { useHeaderResponsive } from "@/providers/HeaderProvider";

export function Topbar({ children, className = "" }: TopbarProps) {
  const { isCompact } = useHeaderResponsive();

  return (
    <header
      role="banner"
      className={`w-full flex items-center shrink-0 bg-white border-b border-gray-100 z-40 transition-all duration-300 ${
        isCompact ? "h-14 px-4" : "h-16 px-6"
      } ${className}`}
    >
      <div className="flex w-full items-center justify-between gap-4 h-full">{children}</div>
    </header>
  );
}

ComponentRegistry.register({
  id: "topbar",
  name: "Topbar",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
