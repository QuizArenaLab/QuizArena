import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionAttachmentPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionAttachmentPlaceholder: React.FC<QuestionAttachmentPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-attachment-placeholder",
      name: "QuestionAttachmentPlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
