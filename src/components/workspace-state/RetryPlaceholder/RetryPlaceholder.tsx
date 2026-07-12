"use client";

import React from "react";
import { RetryPlaceholderProps } from "./RetryPlaceholder.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { Button } from "@/components/primitives/Button";
import { useWorkspaceState } from "@/providers/WorkspaceStateProvider";

export function RetryPlaceholder({
  onRetry,
  explanation = "We couldn't load this content. You can try again.",
  className = "",
}: RetryPlaceholderProps) {
  const { compactMode } = useWorkspaceState();

  if (compactMode) {
    return (
      <div
        className={`flex items-center gap-4 bg-red-50 border border-red-100 rounded-lg p-3 ${className}`}
      >
        <Icon name="AlertCircle" className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-xs text-red-700 font-medium flex-1 truncate">{explanation}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="bg-white border-red-200 text-red-600 hover:bg-red-50 shrink-0 h-8"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-xl text-center max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500 mb-4">
        <Icon name="RefreshCw" className="w-6 h-6" />
      </div>
      <h4 className="font-semibold text-red-900 mb-2">Something went wrong</h4>
      <p className="text-sm text-red-700 mb-6">{explanation}</p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

ComponentRegistry.register({
  id: "retry-placeholder",
  name: "RetryPlaceholder",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
