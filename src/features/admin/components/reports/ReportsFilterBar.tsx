"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import type { ReportFilters } from "@/types/reports";
import {
  REPORT_STATUS_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
  REPORT_TYPE_OPTIONS,
  REPORT_STATUS_LABELS,
  REPORT_PRIORITY_LABELS,
  REPORT_TYPE_LABELS,
} from "@/types/reports";

interface ReportsFilterBarProps {
  filters: ReportFilters;
  onApply: (filters: ReportFilters) => void;
}

export function ReportsFilterBar({ filters, onApply }: ReportsFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [localStatus, setLocalStatus] = useState(filters.status || "");
  const [localPriority, setLocalPriority] = useState(filters.priority || "");
  const [localType, setLocalType] = useState(filters.type || "");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = localStatus || localPriority || localType || localSearch;

  function handleApply() {
    onApply({
      status: localStatus as ReportFilters["status"],
      priority: localPriority as ReportFilters["priority"],
      type: localType as ReportFilters["type"],
      search: localSearch || undefined,
    });
  }

  function handleClear() {
    setLocalSearch("");
    setLocalStatus("");
    setLocalPriority("");
    setLocalType("");
    onApply({});
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleApply();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      {/* Search + Toggle */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search reports by user, email, or content…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-[#0A1C40] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          {/* Status */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">All Statuses</option>
              {REPORT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {REPORT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Priority
            </label>
            <select
              value={localPriority}
              onChange={(e) => setLocalPriority(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">All Priorities</option>
              {REPORT_PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {REPORT_PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Report Type
            </label>
            <select
              value={localType}
              onChange={(e) => setLocalType(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">All Types</option>
              {REPORT_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {REPORT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="sm:col-span-3 flex items-center gap-2 pt-2">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-[#0A1C40] text-white rounded-lg text-xs font-semibold hover:bg-[#0A1C40]/80 transition-colors"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
