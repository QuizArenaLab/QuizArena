"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface PreviewViewProps {
  listContent: ReactNode; // Typically a list or grid of items
  previewContent: ReactNode; // The detailed preview panel
  previewWidth?: string; // e.g., "w-1/3" or "w-96"
  className?: string;
}

export function PreviewView({
  listContent,
  previewContent,
  previewWidth = "w-[400px]",
  className = "",
}: PreviewViewProps) {
  return (
    <div className={`flex w-full h-full divide-x divide-gray-200 overflow-hidden ${className}`}>
      {/* Left Side: List Content */}
      <div className="flex-1 overflow-auto min-w-[300px] h-full p-6">{listContent}</div>

      {/* Right Side: Preview Panel */}
      <div
        className={`${previewWidth} shrink-0 h-full bg-gray-50 overflow-auto border-l border-gray-200 shadow-sm relative z-10`}
      >
        {previewContent}
      </div>
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-preview-view",
  name: "PreviewView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./PreviewView";
