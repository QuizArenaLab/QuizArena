import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface VerificationBannerProps {
  children?: React.ReactNode;
  className?: string;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "verification-banner",
      name: "VerificationBanner",
      category: "identity",
      subtype: "identity-verification",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
