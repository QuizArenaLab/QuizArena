import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { QuestionStatusValue } from "../../models/QuestionStatus";

export interface QuestionStatusBadgeProps {
  status: QuestionStatusValue;
  className?: string;
}

export function QuestionStatusBadge({ status, className = "" }: QuestionStatusBadgeProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-status-badge",
      name: "QuestionStatusBadge",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  const styles: Record<QuestionStatusValue, string> = {
    draft: "bg-gray-100 text-gray-800 border-gray-200",
    review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800 border-green-200",
    archived: "bg-gray-200 text-gray-600 border-gray-300",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status]} ${className}`}
    >
      {status}
    </span>
  );
}
