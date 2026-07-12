import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface StatementSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const StatementSection: React.FC<StatementSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "statement-section",
      name: "StatementSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
