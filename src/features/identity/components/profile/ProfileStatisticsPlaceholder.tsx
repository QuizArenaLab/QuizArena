import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProfileStatisticsPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProfileStatisticsPlaceholder: React.FC<ProfileStatisticsPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "profile-statistics-placeholder",
      name: "ProfileStatisticsPlaceholder",
      category: "identity",
      subtype: "identity-profile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
