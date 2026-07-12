import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionAudioPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionAudioPlaceholder: React.FC<QuestionAudioPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-audio-placeholder",
      name: "QuestionAudioPlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
