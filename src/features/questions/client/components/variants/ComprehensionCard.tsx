import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ComprehensionCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const ComprehensionCard: React.FC<ComprehensionCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "comprehension-card",
      name: "ComprehensionCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
