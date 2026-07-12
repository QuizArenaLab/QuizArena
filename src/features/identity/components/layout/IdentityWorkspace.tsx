import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface IdentityWorkspaceProps {
  children?: React.ReactNode;
  className?: string;
}

export const IdentityWorkspace: React.FC<IdentityWorkspaceProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "identity-workspace",
      name: "IdentityWorkspace",
      category: "identity",
      subtype: "identity-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
