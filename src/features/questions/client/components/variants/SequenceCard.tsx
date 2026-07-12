import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SequenceCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const SequenceCard: React.FC<SequenceCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "sequence-card",
      name: "SequenceCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
