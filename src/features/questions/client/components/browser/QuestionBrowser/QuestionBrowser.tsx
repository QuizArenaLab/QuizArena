"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserProps {
  children: ReactNode;
  className?: string;
}

export function QuestionBrowser({ children, className = "" }: QuestionBrowserProps) {
  return (
    <div className={`flex flex-col w-full h-full bg-gray-50 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser",
  name: "QuestionBrowser",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowser";
