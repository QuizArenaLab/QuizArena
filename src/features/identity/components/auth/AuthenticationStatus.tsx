import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationStatusProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationStatus: React.FC<AuthenticationStatusProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-status",
      name: "AuthenticationStatus",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
