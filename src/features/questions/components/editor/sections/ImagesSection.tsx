import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ImagesSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const ImagesSection: React.FC<ImagesSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "images-section",
      name: "ImagesSection",
      category: "question",
      subtype: "editor-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
