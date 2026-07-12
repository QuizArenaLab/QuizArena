import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorMetadataProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorMetadata: React.FC<InspectorMetadataProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-metadata",
      name: "InspectorMetadata",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
