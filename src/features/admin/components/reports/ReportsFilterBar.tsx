"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import type { ReportFilters, ReportStatus, ReportPriority } from "@/types/reports";

interface ReportsFilterBarProps {
  filters: ReportFilters;
  statusCounts: import("@/types/reports").ReportStatusCounts;
  onApply: (filters: ReportFilters) => void;
}

type MainTab = "ALL" | "OPEN" | "UNDER_REVIEW" | "CRITICAL" | "RESOLVED" | "DISMISSED";
type TypeTab = "ALL" | "USER_ABUSE" | "CHALLENGE_ISSUE" | "INAPPROPRIATE_CONTENT" | "OTHER";

export function ReportsFilterBar({ filters, statusCounts, onApply }: ReportsFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // Derive active tabs from incoming filters
  const activeMainTab: MainTab =
    filters.priority === "CRITICAL" ? "CRITICAL" : (filters.status as MainTab) || "ALL";

  const activeTypeTab: TypeTab = (filters.type as TypeTab) || "ALL";

  // Debounced Search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        onApply({ ...filters, search: localSearch || undefined });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, filters, onApply]);

  const handleMainTabClick = (tab: MainTab) => {
    const newFilters = { ...filters };
    delete newFilters.priority;
    delete newFilters.status;

    if (tab === "CRITICAL") {
      newFilters.priority = "CRITICAL";
    } else if (tab !== "ALL") {
      newFilters.status = tab as ReportStatus;
    }

    onApply(newFilters);
  };

  const handleTypeTabClick = (tab: TypeTab) => {
    const newFilters = { ...filters };
    if (tab === "ALL") {
      delete newFilters.type;
    } else {
      newFilters.type = tab;
    }
    onApply(newFilters);
  };

  const totalAll =
    statusCounts.OPEN + statusCounts.UNDER_REVIEW + statusCounts.RESOLVED + statusCounts.DISMISSED;

  const mainTabs = [
    { id: "ALL", label: `All (${totalAll})` },
    { id: "OPEN", label: `Open (${statusCounts.OPEN})` },
    { id: "UNDER_REVIEW", label: `Under Review (${statusCounts.UNDER_REVIEW})` },
    { id: "CRITICAL", label: `Critical (${statusCounts.CRITICAL})` },
    { id: "RESOLVED", label: `Resolved (${statusCounts.RESOLVED})` },
    { id: "DISMISSED", label: `Dismissed (${statusCounts.DISMISSED})` },
  ];

  const typeTabs = [
    { id: "ALL", label: "All Types" },
    { id: "USER_ABUSE", label: "User Reports" },
    { id: "CHALLENGE_ISSUE", label: "Competition Reports" },
    { id: "INAPPROPRIATE_CONTENT", label: "Content Reports" },
    { id: "OTHER", label: "Other" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Main Status Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleMainTabClick(tab.id as MainTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeMainTab === tab.id
                  ? "bg-[#0A1C40] text-white"
                  : "text-gray-500 hover:text-[#0A1C40] hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center w-full sm:max-w-xs bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#0A1C40] focus-within:border-transparent transition-all overflow-hidden">
          <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search ID, username, competition..."
            className="w-full bg-transparent pl-2 pr-4 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Second Row: Type Tabs */}
      <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-gray-100">
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTypeTabClick(tab.id as TypeTab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTypeTab === tab.id
                ? "bg-gray-200 text-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
