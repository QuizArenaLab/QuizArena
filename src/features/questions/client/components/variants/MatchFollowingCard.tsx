import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MatchFollowingCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const MatchFollowingCard: React.FC<MatchFollowingCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "match-following-card",
      name: "MatchFollowingCard",
      category: "question",
      subtype: "variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
