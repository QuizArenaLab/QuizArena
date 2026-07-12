import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionAuthoringWorkspaceProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionAuthoringWorkspace: React.FC<QuestionAuthoringWorkspaceProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-authoring-workspace",
      name: "QuestionAuthoringWorkspace",
      category: "question",
      subtype: "authoring-workspace",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
