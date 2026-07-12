import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface HintSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const HintSection: React.FC<HintSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "hint-section",
      name: "HintSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
