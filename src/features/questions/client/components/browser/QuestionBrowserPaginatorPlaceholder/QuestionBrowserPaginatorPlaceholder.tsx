import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserPaginatorPlaceholderProps {
  className?: string;
}

export function QuestionBrowserPaginatorPlaceholder({
  className = "",
}: QuestionBrowserPaginatorPlaceholderProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-browser-paginator-placeholder",
      name: "QuestionBrowserPaginatorPlaceholder",
      category: "question",
      subtype: "browser-component",
      version: "1.0.0",
      status: "stable",
      owner: "workspace-architecture",
    });
  }, []);

  return (
    <div
      className={`w-full h-14 border-t border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 ${className}`}
    >
      <div className="text-sm text-gray-500">Pagination UI Placeholder</div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
        <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
        <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
      </div>
    </div>
  );
}
