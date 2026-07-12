"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserToolbarProps {
  children: ReactNode;
  className?: string;
}

export function QuestionBrowserToolbar({ children, className = "" }: QuestionBrowserToolbarProps) {
  return (
    <div
      className={`w-full flex items-center justify-between bg-white px-2 py-2 border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-toolbar",
  name: "QuestionBrowserToolbar",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserToolbar";
