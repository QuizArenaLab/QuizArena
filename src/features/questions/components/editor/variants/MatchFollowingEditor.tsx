import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MatchFollowingEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const MatchFollowingEditor: React.FC<MatchFollowingEditorProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "match-following-editor",
      name: "MatchFollowingEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
