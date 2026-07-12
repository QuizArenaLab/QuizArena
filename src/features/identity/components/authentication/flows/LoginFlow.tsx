import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface LoginFlowProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "login-flow",
      name: "LoginFlow",
      category: "identity",
      subtype: "identity-flow",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
