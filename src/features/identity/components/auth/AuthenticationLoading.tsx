import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthenticationLoadingProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthenticationLoading: React.FC<AuthenticationLoadingProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authentication-loading",
      name: "AuthenticationLoading",
      category: "identity",
      subtype: "identity-auth",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
