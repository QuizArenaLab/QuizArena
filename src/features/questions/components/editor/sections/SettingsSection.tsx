import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SettingsSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "settings-section",
      name: "SettingsSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
