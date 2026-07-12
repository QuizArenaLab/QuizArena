import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface RegisterCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "register-card",
      name: "RegisterCard",
      category: "identity",
      subtype: "identity-register",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
