import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ForgotPasswordCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "forgot-password-card",
      name: "ForgotPasswordCard",
      category: "identity",
      subtype: "identity-password",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
