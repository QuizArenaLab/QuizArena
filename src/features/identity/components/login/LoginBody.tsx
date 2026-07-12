import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface LoginBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoginBody: React.FC<LoginBodyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "login-body",
      name: "LoginBody",
      category: "identity",
      subtype: "identity-login",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
