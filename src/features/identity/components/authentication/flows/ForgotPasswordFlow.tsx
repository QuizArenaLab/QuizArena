import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ForgotPasswordFlowProps {
  children?: React.ReactNode;
  className?: string;
}

export const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "forgot-password-flow",
      name: "ForgotPasswordFlow",
      category: "identity",
      subtype: "identity-flow",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
