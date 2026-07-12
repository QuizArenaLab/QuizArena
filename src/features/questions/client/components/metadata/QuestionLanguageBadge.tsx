import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionLanguageBadgeProps {
  languageCode: string;
  className?: string;
}

export function QuestionLanguageBadge({
  languageCode,
  className = "",
}: QuestionLanguageBadgeProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-language-badge",
      name: "QuestionLanguageBadge",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 uppercase ${className}`}
    >
      {languageCode}
    </span>
  );
}
