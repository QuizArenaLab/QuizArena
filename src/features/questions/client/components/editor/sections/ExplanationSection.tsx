import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ExplanationSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "explanation-section",
      name: "ExplanationSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
