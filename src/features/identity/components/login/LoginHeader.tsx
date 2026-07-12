import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface LoginHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "login-header",
      name: "LoginHeader",
      category: "identity",
      subtype: "identity-login",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
