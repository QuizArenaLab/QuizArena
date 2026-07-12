import { IconName } from "@/icons/IconRegistry";
import React, { ReactNode } from "react";

export interface WorkspacePlaceholderProps {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}
