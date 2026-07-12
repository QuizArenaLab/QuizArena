import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface VerificationInformationProps {
  children?: React.ReactNode;
  className?: string;
}

export const VerificationInformation: React.FC<VerificationInformationProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "verification-information",
      name: "VerificationInformation",
      category: "identity",
      subtype: "identity-verification",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
