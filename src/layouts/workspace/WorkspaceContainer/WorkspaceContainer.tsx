import React from "react";
import { WorkspaceContainerProps } from "./WorkspaceContainer.types";
import { cn } from "@/utilities";

export function WorkspaceContainer({ children, className, ...props }: WorkspaceContainerProps) {
  return (
    <div 
      className={cn("w-full max-w-[1920px] mx-auto flex-1 flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  );
}

import { ComponentRegistry } from '@/registry';
ComponentRegistry.register({
  id: 'layout-workspace-container',
  name: 'WorkspaceContainer',
  category: 'layout',
  version: '1.0.0',
  status: 'stable',
  owner: 'FS-02.1',
});
