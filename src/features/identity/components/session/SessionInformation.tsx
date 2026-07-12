import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SessionInformationProps {
  children?: React.ReactNode;
  className?: string;
}

export const SessionInformation: React.FC<SessionInformationProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "session-information",
      name: "SessionInformation",
      category: "identity",
      subtype: "identity-session",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
