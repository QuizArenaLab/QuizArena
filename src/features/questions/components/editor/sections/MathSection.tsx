import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MathSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const MathSection: React.FC<MathSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "math-section",
      name: "MathSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
