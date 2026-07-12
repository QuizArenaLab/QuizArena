import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface CaseStudyCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "case-study-card",
      name: "CaseStudyCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
