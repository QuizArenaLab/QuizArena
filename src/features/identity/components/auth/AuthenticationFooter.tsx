import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationFooter: React.FC<AuthenticationFooterProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-footer",
      name: "AuthenticationFooter",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
