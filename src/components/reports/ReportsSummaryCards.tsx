"use client";

import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  BarChart3,
  Timer,
} from "lucide-react";
import type { ReportsSummary } from "@/types/reports";

interface ReportsSummaryCardsProps {
  summary: ReportsSummary;
}

export function ReportsSummaryCards({ summary }: ReportsSummaryCardsProps) {
  const cards = [
    {
      label: "Open Reports",
      value: summary.totalOpen,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      accent: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      label: "Under Review",
      value: summary.totalUnderReview,
      icon: Shield,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      accent: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Critical Active",
      value: summary.totalCritical,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      accent: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      label: "High Priority",
      value: summary.totalHigh,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      accent: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      label: "Resolved",
      value: summary.totalResolved,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      accent: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      label: "Dismissed",
      value: summary.totalDismissed,
      icon: XCircle,
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-100",
      accent: "bg-gradient-to-br from-gray-400 to-gray-500",
    },
    {
      label: "Reports Today",
      value: summary.totalReportsToday,
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      accent: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
    {
      label: "Avg Resolution",
      value: `${summary.averageResolutionHours}h`,
      icon: Timer,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      accent: "bg-gradient-to-br from-violet-500 to-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bg} ${card.border} border rounded-xl p-4 relative overflow-hidden group hover:shadow-md transition-all duration-300`}
          >
            {/* Subtle gradient accent */}
            <div
              className={`absolute top-0 right-0 w-16 h-16 ${card.accent} opacity-[0.06] rounded-bl-[40px] group-hover:opacity-[0.1] transition-opacity`}
            />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-2 ${card.bg} rounded-lg`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
