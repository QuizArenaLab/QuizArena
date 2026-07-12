import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorReadinessProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorReadiness: React.FC<InspectorReadinessProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-readiness",
      name: "InspectorReadiness",
      category: "question",
      subtype: "authoring-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
