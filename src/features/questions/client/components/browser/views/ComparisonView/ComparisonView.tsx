"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface ComparisonViewProps {
  children: ReactNode; // Should ideally be an array of exactly 2 or 3 items
  className?: string;
}

export function ComparisonView({ children, className = "" }: ComparisonViewProps) {
  return (
    <div className={`flex w-full h-full gap-4 overflow-x-auto p-4 ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="flex-1 min-w-[350px] max-w-[500px] h-full border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col"
        >
          {child}
        </div>
      ))}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-comparison-view",
  name: "ComparisonView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./ComparisonView";
