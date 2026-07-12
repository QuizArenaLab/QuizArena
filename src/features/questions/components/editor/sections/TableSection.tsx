import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface TableSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const TableSection: React.FC<TableSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "table-section",
      name: "TableSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
