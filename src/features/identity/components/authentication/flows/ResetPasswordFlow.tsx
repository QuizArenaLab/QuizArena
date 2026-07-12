import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ResetPasswordFlowProps {
  children?: React.ReactNode;
  className?: string;
}

export const ResetPasswordFlow: React.FC<ResetPasswordFlowProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "reset-password-flow",
      name: "ResetPasswordFlow",
      category: "identity",
      subtype: "identity-flow",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
