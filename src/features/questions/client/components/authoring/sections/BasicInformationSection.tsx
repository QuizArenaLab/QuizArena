import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface BasicInformationSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "basic-information-section",
      name: "BasicInformationSection",
      category: "question",
      subtype: "authoring-section",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
