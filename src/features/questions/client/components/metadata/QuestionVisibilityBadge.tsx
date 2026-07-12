import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { QuestionVisibilityLevel } from "../../models/QuestionVisibility";
import { Icon } from "@/icons";

export interface QuestionVisibilityBadgeProps {
  level: QuestionVisibilityLevel;
  className?: string;
}

export function QuestionVisibilityBadge({ level, className = "" }: QuestionVisibilityBadgeProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-visibility-badge",
      name: "QuestionVisibilityBadge",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  const getIcon = () => {
    switch (level) {
      case "public":
        return <Icon name="Globe" className="w-3 h-3 mr-1" />;
      case "private":
        return <Icon name="Lock" className="w-3 h-3 mr-1" />;
      case "organization":
        return <Icon name="Building" className="w-3 h-3 mr-1" />;
      case "unlisted":
        return <Icon name="EyeOff" className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <span
      className={`px-2 py-0.5 rounded flex items-center text-xs font-medium bg-muted text-muted-foreground border border-border capitalize ${className}`}
    >
      {getIcon()}
      {level}
    </span>
  );
}
