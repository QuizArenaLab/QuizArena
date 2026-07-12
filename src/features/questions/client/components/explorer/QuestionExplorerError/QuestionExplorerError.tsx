"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { WorkspacePlaceholder } from "@/components/workspace-state/WorkspacePlaceholder";
import { Button } from "@/components/primitives/Button";

export interface QuestionExplorerErrorProps {
  error?: Error;
  onRetry?: () => void;
  className?: string;
}

export function QuestionExplorerError({
  error,
  onRetry,
  className = "",
}: QuestionExplorerErrorProps) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-8 bg-red-50/30 ${className}`}
    >
      <WorkspacePlaceholder
        icon="AlertTriangle"
        title="Failed to load questions"
        description={error?.message || "An unexpected error occurred while fetching data."}
        action={
          onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          )
        }
      />
    </div>
  );
}

ComponentRegistry.register({
  id: "question-explorer-error",
  name: "QuestionExplorerError",
  category: "question" as any,
  subtype: "explorer",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionExplorerError";
