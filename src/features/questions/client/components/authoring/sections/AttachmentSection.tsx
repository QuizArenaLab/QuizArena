import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AttachmentSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const AttachmentSection: React.FC<AttachmentSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "attachment-section",
      name: "AttachmentSection",
      category: "question",
      subtype: "authoring-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
