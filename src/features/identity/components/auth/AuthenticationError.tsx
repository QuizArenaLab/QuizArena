import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationErrorProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationError: React.FC<AuthenticationErrorProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-error",
      name: "AuthenticationError",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
