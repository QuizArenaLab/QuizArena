import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SubjectiveCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const SubjectiveCard: React.FC<SubjectiveCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "subjective-card",
      name: "SubjectiveCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
