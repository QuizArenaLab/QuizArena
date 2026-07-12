import React from "react";
import { ErrorStateVariant } from "@/workspace-state";

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}
