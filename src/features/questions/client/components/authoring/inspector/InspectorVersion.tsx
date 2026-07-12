import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorVersionProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorVersion: React.FC<InspectorVersionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-version",
      name: "InspectorVersion",
      category: "question",
      subtype: "authoring-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
