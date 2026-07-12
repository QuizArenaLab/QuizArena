import React, { ReactNode, useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionMetadataRowProps {
  children: ReactNode;
  className?: string;
}

export function QuestionMetadataRow({ children, className = "" }: QuestionMetadataRowProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-metadata-row",
      name: "QuestionMetadataRow",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={`flex flex-wrap items-center gap-2 mt-2 ${className}`}>{children}</div>;
}
