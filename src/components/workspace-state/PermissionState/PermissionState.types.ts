import React, { ReactNode } from "react";
import { PermissionStateVariant } from "@/workspace-state";

export interface PermissionStateProps {
  variant?: PermissionStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}
