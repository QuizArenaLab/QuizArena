import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ResetPasswordCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "reset-password-card",
      name: "ResetPasswordCard",
      category: "identity",
      subtype: "identity-password",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
