import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface CodingCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const CodingCard: React.FC<CodingCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "coding-card",
      name: "CodingCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
