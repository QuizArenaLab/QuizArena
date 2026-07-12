import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProfileInformationProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "profile-information",
      name: "ProfileInformation",
      category: "identity",
      subtype: "identity-profile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
