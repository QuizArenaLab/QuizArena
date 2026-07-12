import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface RegisterHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const RegisterHeader: React.FC<RegisterHeaderProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "register-header",
      name: "RegisterHeader",
      category: "identity",
      subtype: "identity-register",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
