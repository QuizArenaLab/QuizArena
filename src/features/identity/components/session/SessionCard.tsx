import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SessionCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "session-card",
      name: "SessionCard",
      category: "identity",
      subtype: "identity-session",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
