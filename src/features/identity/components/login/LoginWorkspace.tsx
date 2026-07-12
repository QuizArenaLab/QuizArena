import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface LoginWorkspaceProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoginWorkspace: React.FC<LoginWorkspaceProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "login-workspace",
      name: "LoginWorkspace",
      category: "identity",
      subtype: "identity-login",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
