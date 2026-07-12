import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface WarningPanelProps {
  children?: React.ReactNode;
  className?: string;
}

export const WarningPanel: React.FC<WarningPanelProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "warning-panel",
      name: "WarningPanel",
      category: "question",
      subtype: "authoring-completion",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
