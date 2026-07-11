import React from "react";
import { AppShellProps } from "./AppShell.types";
import { cn } from "@/utilities";
import { ComponentRegistry } from "@/registry";

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      className={cn(
        "min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans antialiased overflow-hidden flex flex-col"
      )}
    >
      <div className="flex-1 w-full max-w-[100vw] safe-area-inset-top safe-area-inset-bottom safe-area-inset-left safe-area-inset-right">
        {children}
      </div>
    </div>
  );
}

ComponentRegistry.register({
  id: "layout-appshell",
  name: "AppShell",
  category: "layout",
  version: "1.0.0",
  status: "stable",
  owner: "FS-02.1",
});
