import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthoringToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthoringToolbar: React.FC<AuthoringToolbarProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authoring-toolbar",
      name: "AuthoringToolbar",
      category: "question",
      subtype: "authoring-workspace",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
