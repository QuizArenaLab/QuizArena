import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MissingSectionPanelProps {
  children?: React.ReactNode;
  className?: string;
}

export const MissingSectionPanel: React.FC<MissingSectionPanelProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "missing-section-panel",
      name: "MissingSectionPanel",
      category: "question",
      subtype: "authoring-completion",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
