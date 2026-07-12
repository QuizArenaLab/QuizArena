import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface IdentitySidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const IdentitySidebar: React.FC<IdentitySidebarProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "identity-sidebar",
      name: "IdentitySidebar",
      category: "identity",
      subtype: "identity-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
