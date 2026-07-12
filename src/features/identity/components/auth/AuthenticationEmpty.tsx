import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationEmpty: React.FC<AuthenticationEmptyProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-empty",
      name: "AuthenticationEmpty",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
