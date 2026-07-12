"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserSummaryProps {
  title: string;
  description?: string;
  className?: string;
}

export function QuestionBrowserSummary({
  title,
  description,
  className = "",
}: QuestionBrowserSummaryProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-summary",
  name: "QuestionBrowserSummary",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserSummary";
