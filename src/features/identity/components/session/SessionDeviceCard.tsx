import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SessionDeviceCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const SessionDeviceCard: React.FC<SessionDeviceCardProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "session-device-card",
      name: "SessionDeviceCard",
      category: "identity",
      subtype: "identity-session",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
