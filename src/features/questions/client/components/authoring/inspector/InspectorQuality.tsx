import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorQualityProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorQuality: React.FC<InspectorQualityProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-quality",
      name: "InspectorQuality",
      category: "question",
      subtype: "authoring-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
