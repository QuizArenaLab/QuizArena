import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthoringInspectorProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthoringInspector: React.FC<AuthoringInspectorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authoring-inspector",
      name: "AuthoringInspector",
      category: "question",
      subtype: "authoring-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
