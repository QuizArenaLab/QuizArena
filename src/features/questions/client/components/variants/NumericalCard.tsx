import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NumericalCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const NumericalCard: React.FC<NumericalCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "numerical-card",
      name: "NumericalCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
