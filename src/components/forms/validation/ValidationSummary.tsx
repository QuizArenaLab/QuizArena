import React from "react";
import { ValidationIssue } from "./ValidationAdapter";

export interface ValidationSummaryProps {
  issues: ValidationIssue[];
}

export function ValidationSummary({ issues }: ValidationSummaryProps) {
  if (issues.length === 0) return null;

  return (
    <div className="p-4 rounded-md bg-gray-50 border border-gray-200 mt-4">
      <h3 className="text-sm font-medium text-gray-800 mb-2">Validation Summary</h3>
      <ul className="space-y-1">
        {issues.map((issue, index) => {
          const color =
            issue.severity === "Error"
              ? "text-red-600"
              : issue.severity === "Warning"
                ? "text-yellow-600"
                : issue.severity === "Success"
                  ? "text-green-600"
                  : "text-blue-600";

          return (
            <li key={index} className={`text-sm ${color}`}>
              {issue.path.length > 0 ? `${issue.path.join(".")}: ` : ""}
              {issue.message}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
