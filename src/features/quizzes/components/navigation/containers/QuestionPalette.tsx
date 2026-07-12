import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionPaletteProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-palette",
      name: "QuestionPalette",
      category: "quiz",
      subtype: "navigation-container",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
