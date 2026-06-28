"use client";

import { useState } from "react";
import {
  ValidationReport,
  ValidationCategory,
  ValidationSeverity,
  ValidationItem,
} from "../validation/types/validation.types";
import { AlertCircle, AlertTriangle, Info, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CompetitionWithRelations } from "../../types";

interface ValidationReportPanelProps {
  competition: CompetitionWithRelations;
  report: ValidationReport;
  isValidating: boolean;
  onRevalidate: () => void;
}

export function ValidationReportPanel({
  competition,
  report,
  isValidating,
  onRevalidate,
}: ValidationReportPanelProps) {
  const [activeCategory, setActiveCategory] = useState<ValidationCategory>("CONFIGURATION");

  const categories: { key: ValidationCategory; label: string }[] = [
    { key: "CONFIGURATION", label: "Config" },
    { key: "STRUCTURE", label: "Structure" },
    { key: "QUESTION_QUALITY", label: "Quality" },
    { key: "RULES", label: "Rules" },
    { key: "SCHEDULING", label: "Scheduling" },
    { key: "BUSINESS", label: "Business" },
  ];

  const renderIcon = (severity: ValidationSeverity) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "recommendation":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const activeItems = report.byCategory[activeCategory] || [];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            Validation Report
            <span className="text-xs font-normal text-gray-500 ml-2">
              Generated {new Date(report.generatedAt).toLocaleTimeString()}
            </span>
          </h2>
        </div>
        <button
          onClick={onRevalidate}
          disabled={isValidating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isValidating ? "animate-spin" : ""}`} />
          {isValidating ? "Validating..." : "Re-run"}
        </button>
      </div>

      {/* Summary Badges */}
      <div className="flex gap-4 p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="font-bold">{report.counts.error}</span> Errors
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-bold">{report.counts.warning}</span> Warnings
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
          <Info className="w-4 h-4" />
          <span className="font-bold">{report.counts.recommendation}</span> Suggestions
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {categories.map((cat) => {
          const catItems = report.byCategory[cat.key] || [];
          const hasError = catItems.some((i) => i.severity === "error");

          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2
                ${activeCategory === cat.key ? "border-primary text-primary bg-primary/5" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              {cat.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold
                ${hasError ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
              >
                {catItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        {activeItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-medium text-gray-500">No issues found in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{renderIcon(item.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.code}
                      </span>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                    {item.fixSuggestion && (
                      <div className="text-sm bg-blue-50/50 text-blue-800 p-2 rounded mb-3 border border-blue-100/50">
                        <span className="font-semibold">Suggestion:</span> {item.fixSuggestion}
                      </div>
                    )}

                    {item.affectedEntity && (
                      <Link
                        href={`/admin/dashboard/competitions/${competition.id}/builder?highlight=${item.affectedEntity.type}`}
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Fix issue in Builder <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
