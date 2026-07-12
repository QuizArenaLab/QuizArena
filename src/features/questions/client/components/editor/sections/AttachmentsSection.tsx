import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AttachmentsSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "attachments-section",
      name: "AttachmentsSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
