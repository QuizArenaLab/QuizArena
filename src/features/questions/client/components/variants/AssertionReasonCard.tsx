import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AssertionReasonCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const AssertionReasonCard: React.FC<AssertionReasonCardProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "assertion-reason-card",
      name: "AssertionReasonCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
