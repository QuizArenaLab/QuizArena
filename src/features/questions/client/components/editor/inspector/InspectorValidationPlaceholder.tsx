import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorValidationPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorValidationPlaceholder: React.FC<InspectorValidationPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-validation-placeholder",
      name: "InspectorValidationPlaceholder",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
