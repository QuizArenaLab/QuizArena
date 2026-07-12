import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionTagGroupProps {
  tags: string[];
  className?: string;
}

export function QuestionTagGroup({ tags, className = "" }: QuestionTagGroupProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-tag-group",
      name: "QuestionTagGroup",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 mt-2 ${className}`}>
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="px-2 py-0.5 bg-accent text-accent-foreground rounded text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
