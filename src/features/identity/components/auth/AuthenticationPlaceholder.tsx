import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationPlaceholder: React.FC<AuthenticationPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-placeholder",
      name: "AuthenticationPlaceholder",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
