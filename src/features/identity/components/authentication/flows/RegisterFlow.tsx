import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface RegisterFlowProps {
  children?: React.ReactNode;
  className?: string;
}

export const RegisterFlow: React.FC<RegisterFlowProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "register-flow",
      name: "RegisterFlow",
      category: "identity",
      subtype: "identity-flow",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
