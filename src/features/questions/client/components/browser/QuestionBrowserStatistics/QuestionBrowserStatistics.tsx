"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserStatisticsProps {
  totalQuestions?: number;
  totalCategories?: number;
  totalTags?: number;
  className?: string;
}

export function QuestionBrowserStatistics({
  totalQuestions = 0,
  totalCategories = 0,
  totalTags = 0,
  className = "",
}: QuestionBrowserStatisticsProps) {
  return (
    <div className={`flex items-center gap-6 text-sm text-gray-600 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{totalQuestions.toLocaleString()}</span>
        <span>Questions</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{totalCategories.toLocaleString()}</span>
        <span>Categories</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{totalTags.toLocaleString()}</span>
        <span>Tags</span>
      </div>
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-statistics",
  name: "QuestionBrowserStatistics",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserStatistics";
