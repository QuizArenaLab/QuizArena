"use client";

import React from "react";
import { LoadingStateProps } from "./LoadingState.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { SkeletonLayout } from "../SkeletonLayout";

export function LoadingState({
  variant = "spinner",
  text = "Loading...",
  className = "",
}: LoadingStateProps) {
  if (variant === "skeleton" || variant === "dashboard") {
    return (
      <div className={`w-full ${className}`} role="status" aria-busy="true" aria-label={text}>
        <SkeletonLayout variant="dashboard" />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`w-full ${className}`} role="status" aria-busy="true" aria-label={text}>
        <SkeletonLayout variant="table" rows={5} />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`w-full ${className}`} role="status" aria-busy="true" aria-label={text}>
        <SkeletonLayout variant="card" />
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-2 text-gray-500 ${className}`}
        role="status"
        aria-busy="true"
      >
        <Icon name="Loader" className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm ${className}`}
        role="status"
        aria-busy="true"
      >
        <Icon name="Loader" className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="text-lg font-medium text-navy">{text}</span>
      </div>
    );
  }

  // default to spinner
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full p-12 ${className}`}
      role="status"
      aria-busy="true"
    >
      <Icon name="Loader" className="w-8 h-8 animate-spin text-primary mb-4" />
      <span className="text-sm font-medium text-gray-500">{text}</span>
    </div>
  );
}

ComponentRegistry.register({
  id: "loading-state",
  name: "LoadingState",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
