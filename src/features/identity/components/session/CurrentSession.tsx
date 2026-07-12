import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface CurrentSessionProps {
  children?: React.ReactNode;
  className?: string;
}

export const CurrentSession: React.FC<CurrentSessionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "current-session",
      name: "CurrentSession",
      category: "identity",
      subtype: "identity-session",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
