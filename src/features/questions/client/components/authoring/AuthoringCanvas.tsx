import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface AuthoringCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuthoringCanvas: React.FC<AuthoringCanvasProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "authoring-canvas",
      name: "AuthoringCanvas",
      category: "question",
      subtype: "authoring-workspace",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
