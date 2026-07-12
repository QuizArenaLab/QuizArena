import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface TrueFalseCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const TrueFalseCard: React.FC<TrueFalseCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "true-false-card",
      name: "TrueFalseCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
