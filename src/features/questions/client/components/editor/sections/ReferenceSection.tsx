import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ReferenceSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "reference-section",
      name: "ReferenceSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
