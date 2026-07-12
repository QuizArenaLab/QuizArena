import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { NavigationItemPresentation } from "../../../navigation/NavigationItemPresentation";

export interface QuestionTileProps {
  presentation: NavigationItemPresentation;
  headerSlot?: React.ReactNode;
  bodySlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  leadingSlot?: React.ReactNode;
  trailingSlot?: React.ReactNode;
  badgeSlot?: React.ReactNode;
  overlaySlot?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const QuestionTile: React.FC<QuestionTileProps> = ({
  presentation,
  headerSlot,
  bodySlot,
  footerSlot,
  leadingSlot,
  trailingSlot,
  badgeSlot,
  overlaySlot,
  className,
  onClick,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-tile",
      name: "QuestionTile",
      category: "quiz",
      subtype: "navigation-tile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <div className={className || ""} onClick={onClick}>
      {overlaySlot}
      {badgeSlot}
      <div className="flex">
        {leadingSlot}
        <div className="flex-1 flex flex-col">
          {headerSlot}
          {bodySlot}
          {footerSlot}
        </div>
        {trailingSlot}
      </div>
    </div>
  );
};
