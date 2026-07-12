import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MSQCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const MSQCard: React.FC<MSQCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "msqcard",
      name: "MSQCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
