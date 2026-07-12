import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationBody: React.FC<AuthenticationBodyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-body",
      name: "AuthenticationBody",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
