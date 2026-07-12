import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface VerifyEmailFlowProps {
  children?: React.ReactNode;
  className?: string;
}

export const VerifyEmailFlow: React.FC<VerifyEmailFlowProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "verify-email-flow",
      name: "VerifyEmailFlow",
      category: "identity",
      subtype: "identity-flow",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
