import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface UserProfileCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "user-profile-card",
      name: "UserProfileCard",
      category: "identity",
      subtype: "identity-profile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
