"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserFooterProps {
  children: ReactNode;
  className?: string;
}

export function QuestionBrowserFooter({ children, className = "" }: QuestionBrowserFooterProps) {
  return (
    <div
      className={`shrink-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-footer",
  name: "QuestionBrowserFooter",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserFooter";
