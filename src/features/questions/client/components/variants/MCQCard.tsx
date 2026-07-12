import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MCQCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const MCQCard: React.FC<MCQCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "mcqcard",
      name: "MCQCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
