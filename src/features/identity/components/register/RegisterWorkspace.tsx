import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface RegisterWorkspaceProps {
  children?: React.ReactNode;
  className?: string;
}

export const RegisterWorkspace: React.FC<RegisterWorkspaceProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "register-workspace",
      name: "RegisterWorkspace",
      category: "identity",
      subtype: "identity-register",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
