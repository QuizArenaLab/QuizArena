import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QualityChecklistProps {
  children?: React.ReactNode;
  className?: string;
}

export const QualityChecklist: React.FC<QualityChecklistProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quality-checklist",
      name: "QualityChecklist",
      category: "question",
      subtype: "authoring-completion",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
