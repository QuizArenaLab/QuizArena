import React from "react";
import { WorkspaceAsideProps } from "./WorkspaceAside.types";
import { cn } from "@/utilities";

export function WorkspaceAside({ children, className, ...props }: WorkspaceAsideProps) {
  return (
    <aside
      className={cn(
        "w-64 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

import { ComponentRegistry } from "@/registry";
ComponentRegistry.register({
  id: "layout-workspace-aside",
  name: "WorkspaceAside",
  category: "layout",
  version: "1.0.0",
  status: "stable",
  owner: "FS-02.1",
});
