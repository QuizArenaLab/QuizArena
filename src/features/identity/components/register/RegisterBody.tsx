import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface RegisterBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const RegisterBody: React.FC<RegisterBodyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "register-body",
      name: "RegisterBody",
      category: "identity",
      subtype: "identity-register",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
