import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface OptionsSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "options-section",
      name: "OptionsSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
