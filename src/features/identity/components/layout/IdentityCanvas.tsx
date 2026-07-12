import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface IdentityCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

export const IdentityCanvas: React.FC<IdentityCanvasProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "identity-canvas",
      name: "IdentityCanvas",
      category: "identity",
      subtype: "identity-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
