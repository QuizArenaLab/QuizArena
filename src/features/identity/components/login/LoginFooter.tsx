import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface LoginFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "login-footer",
      name: "LoginFooter",
      category: "identity",
      subtype: "identity-login",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
