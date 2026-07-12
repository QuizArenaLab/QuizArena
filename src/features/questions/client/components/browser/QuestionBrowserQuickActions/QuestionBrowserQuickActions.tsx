import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserQuickActionsProps {
  className?: string;
}

export function QuestionBrowserQuickActions({ className = "" }: QuestionBrowserQuickActionsProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-browser-quick-actions",
      name: "QuestionBrowserQuickActions",
      category: "question",
      subtype: "browser-component",
      version: "1.0.0",
      status: "stable",
      owner: "workspace-architecture",
    });
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* UI Shell for Add Question, Import, Export, Bulk Edit, Bulk Delete, AI Review */}
      <div className="h-9 w-24 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium rounded-md flex items-center justify-center">
        Quick Actions
      </div>
    </div>
  );
}
