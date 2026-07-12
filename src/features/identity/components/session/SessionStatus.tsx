import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SessionStatusProps {
  children?: React.ReactNode;
  className?: string;
}

export const SessionStatus: React.FC<SessionStatusProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "session-status",
      name: "SessionStatus",
      category: "identity",
      subtype: "identity-session",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
