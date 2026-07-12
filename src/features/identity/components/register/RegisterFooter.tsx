import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface RegisterFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export const RegisterFooter: React.FC<RegisterFooterProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "register-footer",
      name: "RegisterFooter",
      category: "identity",
      subtype: "identity-register",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
