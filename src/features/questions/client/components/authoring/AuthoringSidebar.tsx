import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthoringSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthoringSidebar: React.FC<AuthoringSidebarProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authoring-sidebar",
      name: "AuthoringSidebar",
      category: "question",
      subtype: "authoring-workspace",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
