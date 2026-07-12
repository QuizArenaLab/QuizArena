import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AnswerSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const AnswerSection: React.FC<AnswerSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "answer-section",
      name: "AnswerSection",
      category: "question",
      subtype: "authoring-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
