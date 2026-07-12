import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationToolbarRegionProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationToolbarRegion: React.FC<NavigationToolbarRegionProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-toolbar-region",
      name: "NavigationToolbarRegion",
      category: "quiz",
      subtype: "navigation-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
