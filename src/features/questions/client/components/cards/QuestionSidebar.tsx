import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionSidebar: React.FC<QuestionSidebarProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-sidebar",
      name: "QuestionSidebar",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <aside className={className || ""}>{children}</aside>;
};
