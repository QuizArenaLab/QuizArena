import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionVersionBadgeProps {
  versionNumber: number;
  isLatest?: boolean;
  className?: string;
}

export function QuestionVersionBadge({
  versionNumber,
  isLatest,
  className = "",
}: QuestionVersionBadgeProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-version-badge",
      name: "QuestionVersionBadge",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium border ${isLatest ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-gray-100 text-gray-600 border-gray-200"} ${className}`}
    >
      v{versionNumber} {isLatest && "(Latest)"}
    </span>
  );
}
