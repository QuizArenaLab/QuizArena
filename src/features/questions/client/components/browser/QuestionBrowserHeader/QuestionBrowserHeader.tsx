"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserHeaderProps {
  children: ReactNode;
  className?: string;
}

export function QuestionBrowserHeader({ children, className = "" }: QuestionBrowserHeaderProps) {
  return (
    <div
      className={`shrink-0 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-header",
  name: "QuestionBrowserHeader",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserHeader";
