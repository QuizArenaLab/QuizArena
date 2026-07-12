import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AssertionReasonEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const AssertionReasonEditor: React.FC<AssertionReasonEditorProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "assertion-reason-editor",
      name: "AssertionReasonEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
