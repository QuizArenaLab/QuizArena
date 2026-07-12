import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface EmailVerificationCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "email-verification-card",
      name: "EmailVerificationCard",
      category: "identity",
      subtype: "identity-verification",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
