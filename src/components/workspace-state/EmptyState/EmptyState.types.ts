import React, { ReactNode } from "react";
import { EmptyStateVariant } from "@/workspace-state";
import { IconName } from "@/icons/IconRegistry";

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
}
