import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationWorkspaceProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationWorkspace: React.FC<AuthenticationWorkspaceProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-workspace",
      name: "AuthenticationWorkspace",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
