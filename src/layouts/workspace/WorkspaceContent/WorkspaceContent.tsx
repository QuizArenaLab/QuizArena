import React from "react";
import { WorkspaceContentProps } from "./WorkspaceContent.types";
import { cn } from "@/utilities";

export function WorkspaceContent({ children, className, ...props }: WorkspaceContentProps) {
  return (
    <div className={cn("flex-1 flex flex-col min-h-0", className)} {...props}>
      {children}
    </div>
  );
}

import { ComponentRegistry } from "@/registry";
ComponentRegistry.register({
  id: "layout-workspace-content",
  name: "WorkspaceContent",
  category: "layout",
  version: "1.0.0",
  status: "stable",
  owner: "FS-02.1",
});
