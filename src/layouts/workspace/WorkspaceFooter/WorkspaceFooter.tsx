import React from "react";
import { WorkspaceFooterProps } from "./WorkspaceFooter.types";
import { cn } from "@/utilities";

export function WorkspaceFooter({ children, className, ...props }: WorkspaceFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </footer>
  );
}

import { ComponentRegistry } from "@/registry";
ComponentRegistry.register({
  id: "layout-workspace-footer",
  name: "WorkspaceFooter",
  category: "layout",
  version: "1.0.0",
  status: "stable",
  owner: "FS-02.1",
});
