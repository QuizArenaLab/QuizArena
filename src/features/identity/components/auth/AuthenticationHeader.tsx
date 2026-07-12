import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationHeader: React.FC<AuthenticationHeaderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-header",
      name: "AuthenticationHeader",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
