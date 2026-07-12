import React, { ReactNode } from "react";
import { MaintenanceStateVariant } from "@/workspace-state";

export interface MaintenanceStateProps {
  variant?: MaintenanceStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}
