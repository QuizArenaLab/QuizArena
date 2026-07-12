import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { QuestionDifficultyLevel } from "../../models/QuestionDifficulty";

export interface QuestionDifficultyBadgeProps {
  level: QuestionDifficultyLevel;
  className?: string;
}

export function QuestionDifficultyBadge({ level, className = "" }: QuestionDifficultyBadgeProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-difficulty-badge",
      name: "QuestionDifficultyBadge",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  const styles: Record<QuestionDifficultyLevel, string> = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-blue-100 text-blue-800 border-blue-200",
    advanced: "bg-orange-100 text-orange-800 border-orange-200",
    expert: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${styles[level]} ${className}`}
    >
      {level}
    </span>
  );
}
