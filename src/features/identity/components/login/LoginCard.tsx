import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface LoginCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "login-card",
      name: "LoginCard",
      category: "identity",
      subtype: "identity-login",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
