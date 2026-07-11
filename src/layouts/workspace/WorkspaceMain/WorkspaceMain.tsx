import React from "react";
import { WorkspaceMainProps } from "./WorkspaceMain.types";
import { cn } from "@/utilities";

export function WorkspaceMain({ children, className, ...props }: WorkspaceMainProps) {
  return (
    <main 
      className={cn("flex-1 overflow-y-auto p-4 md:p-8", className)}
      {...props}
    >
      {children}
    </main>
  );
}

import { ComponentRegistry } from '@/registry';
ComponentRegistry.register({
  id: 'layout-workspace-main',
  name: 'WorkspaceMain',
  category: 'layout',
  version: '1.0.0',
  status: 'stable',
  owner: 'FS-02.1',
});
