import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface CompletionMeterProps {
  children?: React.ReactNode;
  className?: string;
}

export const CompletionMeter: React.FC<CompletionMeterProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "completion-meter",
      name: "CompletionMeter",
      category: "question",
      subtype: "authoring-completion",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
