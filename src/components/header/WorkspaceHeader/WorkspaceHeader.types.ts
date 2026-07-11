import React, { ReactNode } from "react";

export interface WorkspaceHeaderProps {
  className?: string;
  leftNode?: ReactNode; // e.g., Title & Subtitle composition
  rightNode?: ReactNode; // e.g., Actions composition
}
