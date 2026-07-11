import React from "react";
import { WorkspaceBodyProps } from "./WorkspaceBody.types";
import { cn } from "@/utilities";

export function WorkspaceBody({ children, className, ...props }: WorkspaceBodyProps) {
  return (
    <div 
      className={cn("flex-1 flex overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

import { ComponentRegistry } from '@/registry';
ComponentRegistry.register({
  id: 'layout-workspace-body',
  name: 'WorkspaceBody',
  category: 'layout',
  version: '1.0.0',
  status: 'stable',
  owner: 'FS-02.1',
});
