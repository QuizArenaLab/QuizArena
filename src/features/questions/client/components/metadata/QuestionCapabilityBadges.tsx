import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCapabilityBadgesProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionCapabilityBadges: React.FC<QuestionCapabilityBadgesProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-capability-badges",
      name: "QuestionCapabilityBadges",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
