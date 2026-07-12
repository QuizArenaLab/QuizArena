import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AvatarPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "avatar-placeholder",
      name: "AvatarPlaceholder",
      category: "identity",
      subtype: "identity-profile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
