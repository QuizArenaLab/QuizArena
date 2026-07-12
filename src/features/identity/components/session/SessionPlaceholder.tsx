import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SessionPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const SessionPlaceholder: React.FC<SessionPlaceholderProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "session-placeholder",
      name: "SessionPlaceholder",
      category: "identity",
      subtype: "identity-session",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
