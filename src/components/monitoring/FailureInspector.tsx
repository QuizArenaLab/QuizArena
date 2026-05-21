"use client";

import { Search, AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { FailureRecord } from "@/types/monitoring";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";

interface FailureInspectorProps {
  failures: FailureRecord[];
}

const FAILURE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  JOB_FAILURE: { label: "Job Failure", color: "bg-red-50 text-red-700" },
  SCHEDULING_FAILURE: { label: "Scheduling", color: "bg-amber-50 text-amber-700" },
  MODERATION_ERROR: { label: "Moderation", color: "bg-violet-50 text-violet-700" },
  AUTH_FAILURE: { label: "Auth Failure", color: "bg-orange-50 text-orange-700" },
  OPERATION_ERROR: { label: "Operation", color: "bg-gray-100 text-gray-700" },
};

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FailureInspector({ failures }: FailureInspectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  const filteredFailures = failures.filter((f) => {
    const matchesSearch =
      searchQuery === "" ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResolved = showResolved || !f.resolved;
    return matchesSearch && matchesResolved;
  });

  const unresolvedCount = failures.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm font-bold text-[#0A1C40]">Failure Inspector</span>
          {unresolvedCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
              {unresolvedCount} unresolved
            </span>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search failures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6701e]/20 focus:border-[#e6701e]/30 transition-all"
          />
        </div>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className={`text-[11px] font-medium px-3 py-2 rounded-lg border transition-colors ${
            showResolved
              ? "bg-gray-100 border-gray-200 text-[#0A1C40]"
              : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>

      {/* Failure Records */}
      <div className="space-y-2">
        {filteredFailures.map((failure) => {
          const typeConfig = FAILURE_TYPE_LABELS[failure.type] ?? {
            label: failure.type,
            color: "bg-gray-100 text-gray-700",
          };

          return (
            <div
              key={failure.id}
              className={`bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow duration-200 ${
                failure.resolved ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-semibold text-[#0A1C40] truncate">
                      {failure.title}
                    </h4>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeConfig.color}`}
                    >
                      {typeConfig.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{failure.description}</p>
                </div>
                {failure.resolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(failure.timestamp)}
                </div>
                {failure.resolved ? (
                  <StatusBadge status="HEALTHY" size="sm" />
                ) : (
                  <StatusBadge status="CRITICAL" size="sm" pulse />
                )}
                {Object.entries(failure.metadata).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFailures.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-[#0A1C40]">No failures detected</p>
          <p className="text-[11px] text-gray-500 mt-1">
            {searchQuery ? "No failures match your search" : "All operations are running smoothly"}
          </p>
        </div>
      )}
    </div>
  );
}
