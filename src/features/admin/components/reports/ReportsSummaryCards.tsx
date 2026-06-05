"use client";

import {
  AlertTriangle,
  Clock,
  Shield,
  CheckCircle,
  Timer,
  AlertOctagon,
} from "lucide-react";
import type { ReportsSummary, ReportFilters } from "@/types/reports";

interface ReportsSummaryCardsProps {
  summary: ReportsSummary;
  onFilterClick?: (filters: ReportFilters) => void;
}

export function ReportsSummaryCards({ summary, onFilterClick }: ReportsSummaryCardsProps) {
  const cards = [
    {
      id: "open",
      label: "Open Reports",
      value: summary.totalOpen,
      icon: Clock,
      color: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
      accent: "bg-gray-300",
      filter: { status: "OPEN" as const },
    },
    {
      id: "review",
      label: "Under Review",
      value: summary.totalUnderReview,
      icon: Shield,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      accent: "bg-blue-300",
      filter: { status: "UNDER_REVIEW" as const },
    },
    {
      id: "critical",
      label: "Critical Cases",
      value: summary.totalCritical,
      icon: AlertTriangle,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      accent: "bg-red-300",
      filter: { priority: "CRITICAL" as const },
    },
    {
      id: "resolved",
      label: "Resolved Today",
      value: summary.totalResolved,
      icon: CheckCircle,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      accent: "bg-emerald-300",
      filter: { status: "RESOLVED" as const },
    },
    {
      id: "time",
      label: "Avg Resolution Time",
      value: `${summary.averageResolutionHours}h`,
      icon: Timer,
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
      accent: "bg-purple-300",
      filter: {}, // No specific filter
    },
    {
      id: "falseRate",
      label: "False Report Rate",
      value: `${summary.falseReportRate}%`,
      icon: AlertOctagon,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      accent: "bg-amber-300",
      filter: {}, // No specific filter
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = Object.keys(card.filter).length > 0;

        return (
          <div
            key={card.id}
            onClick={() => isClickable && onFilterClick?.(card.filter)}
            className={`${card.bg} ${card.border} border rounded-xl p-4 relative overflow-hidden group transition-all duration-300 ${isClickable ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""
              }`}
          >
            {/* Subtle gradient accent */}
            <div
              className={`absolute top-0 right-0 w-16 h-16 ${card.accent} opacity-20 rounded-bl-[40px] group-hover:opacity-30 transition-opacity`}
            />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-2 bg-white/60 rounded-lg shadow-sm shrink-0 ml-2`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
