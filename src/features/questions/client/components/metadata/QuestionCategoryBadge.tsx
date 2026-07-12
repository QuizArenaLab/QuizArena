import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCategoryBadgeProps {
  categoryName: string;
  className?: string;
}

export function QuestionCategoryBadge({
  categoryName,
  className = "",
}: QuestionCategoryBadgeProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-category-badge",
      name: "QuestionCategoryBadge",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border ${className}`}
    >
      {categoryName}
    </span>
  );
}
