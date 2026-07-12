import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface BookmarkBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const BookmarkBadge: React.FC<BookmarkBadgeProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "bookmark-badge",
      name: "BookmarkBadge",
      category: "quiz",
      subtype: "navigation-tile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
