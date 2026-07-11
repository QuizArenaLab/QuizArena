import React from "react";
import { ValidationSeverity } from "./ValidationAdapter";

export interface ValidationMessageProps {
  message: string;
  severity: ValidationSeverity;
}

export function ValidationMessage({ message, severity }: ValidationMessageProps) {
  const severityColors = {
    Info: "text-blue-500",
    Success: "text-green-500",
    Warning: "text-yellow-500",
    Error: "text-red-500",
  };

  return <span className={`text-sm mt-1 ${severityColors[severity]}`}>{message}</span>;
}
