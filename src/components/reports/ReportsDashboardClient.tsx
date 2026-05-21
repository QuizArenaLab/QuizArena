"use client";

import { useState, useCallback } from "react";
import {
  Shield,
  RefreshCw,
  Clock,
  AlertTriangle,
  BarChart3,
  FileText,
  Search,
  Eye,
  Activity,
  ShieldAlert,
} from "lucide-react";
import type { ReportsDashboardData, ReportData, ReportFilters } from "@/types/reports";
import { ReportsSummaryCards } from "./ReportsSummaryCards";
import { ReportsTable } from "./ReportsTable";
import { ReportInvestigationPanel } from "./ReportInvestigationPanel";
import { AbuseTrendsChart } from "./AbuseTrendsChart";
import { SuspiciousActivityPanel } from "./SuspiciousActivityPanel";
import { ModerationActionsLog } from "./ModerationActionsLog";
import { ReportsFilterBar } from "./ReportsFilterBar";

interface ReportsDashboardClientProps {
  initialData: ReportsDashboardData;
}

type ReportsTab = "overview" | "open" | "high_priority" | "trends" | "moderation" | "suspicious";

const TABS: { id: ReportsTab; label: string; icon: typeof Shield }[] = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "open", label: "Open Reports", icon: FileText },
  { id: "high_priority", label: "High Priority", icon: AlertTriangle },
  { id: "trends", label: "Abuse Trends", icon: BarChart3 },
  { id: "moderation", label: "Moderation Log", icon: Activity },
  { id: "suspicious", label: "Suspicious Activity", icon: ShieldAlert },
];

function getInitialTab(): ReportsTab {
  if (typeof window === "undefined") return "overview";
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") as ReportsTab | null;
  if (tab && TABS.some((t) => t.id === tab)) return tab;
  return "overview";
}

function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ReportsDashboardClient({ initialData }: ReportsDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<ReportsTab>(getInitialTab);
  const [data, setData] = useState<ReportsDashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [filteredReports, setFilteredReports] = useState<ReportData[] | null>(null);
  const [activeFilters, setActiveFilters] = useState<ReportFilters>({});

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { getReportsDashboardData } = await import("@/actions/reports");
      const freshData = await getReportsDashboardData();
      setData(freshData);
      setLastRefreshed(new Date());
      setSelectedReport(null);
      setFilteredReports(null);
    } catch (error) {
      console.error("Failed to refresh reports data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleFilterApply = useCallback(async (filters: ReportFilters) => {
    setActiveFilters(filters);
    const hasFilters = filters.status || filters.priority || filters.type || filters.search;
    if (!hasFilters) {
      setFilteredReports(null);
      return;
    }
    try {
      const { getFilteredReports } = await import("@/actions/reports");
      const results = await getFilteredReports(filters);
      setFilteredReports(results);
    } catch (error) {
      console.error("Failed to filter reports:", error);
    }
  }, []);

  const handleOpenInvestigation = useCallback((report: ReportData) => {
    setSelectedReport(report);
  }, []);

  const handleCloseInvestigation = useCallback(() => {
    setSelectedReport(null);
  }, []);

  const handleModerationComplete = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const criticalCount = data.summary.totalCritical;
  const openCount = data.summary.totalOpen;

  // If a report is selected, show investigation view
  if (selectedReport) {
    return (
      <ReportInvestigationPanel
        report={selectedReport}
        onClose={handleCloseInvestigation}
        onActionComplete={handleModerationComplete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-red-700 to-red-500 rounded-xl shadow-lg shadow-red-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0A1C40]">Reports & Abuse Management</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Last updated: {formatLastUpdated(lastRefreshed)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <button
              onClick={() => setActiveTab("high_priority")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-[11px] font-semibold hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              {criticalCount} Critical
            </button>
          )}
          {openCount > 0 && (
            <button
              onClick={() => setActiveTab("open")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-semibold hover:bg-amber-100 transition-colors"
            >
              <Eye className="w-3 h-3" />
              {openCount} Open
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#0A1C40] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasNotification =
            (tab.id === "high_priority" && criticalCount > 0) ||
            (tab.id === "suspicious" && data.suspiciousActivity.length > 0);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap relative ${
                isActive
                  ? "bg-[#0A1C40] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#0A1C40] hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {hasNotification && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-red-400" : "bg-red-500"
                  } animate-pulse`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <ReportsSummaryCards summary={data.summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AbuseTrendsChart trends={data.abuseTrends} />
              <ModerationActionsLog actions={data.recentModActions} />
            </div>
            {data.highPriorityReports.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0A1C40] mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  High Priority Reports Requiring Attention
                </h2>
                <ReportsTable
                  reports={data.highPriorityReports.slice(0, 5)}
                  onInvestigate={handleOpenInvestigation}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "open" && (
          <div className="space-y-4">
            <ReportsFilterBar filters={activeFilters} onApply={handleFilterApply} />
            <ReportsTable
              reports={
                filteredReports ||
                data.recentReports.filter((r) => r.status === "OPEN" || r.status === "UNDER_REVIEW")
              }
              onInvestigate={handleOpenInvestigation}
              emptyMessage="No open reports found."
            />
          </div>
        )}

        {activeTab === "high_priority" && (
          <div className="space-y-4">
            <ReportsFilterBar filters={activeFilters} onApply={handleFilterApply} />
            <ReportsTable
              reports={filteredReports || data.highPriorityReports}
              onInvestigate={handleOpenInvestigation}
              emptyMessage="No high priority reports. Platform integrity is looking healthy."
            />
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-6">
            <AbuseTrendsChart trends={data.abuseTrends} fullWidth />
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-[#0A1C40] mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                Resolved Reports History
              </h3>
              <ReportsTable
                reports={data.recentReports.filter((r) => r.status === "RESOLVED")}
                onInvestigate={handleOpenInvestigation}
                emptyMessage="No resolved reports yet."
              />
            </div>
          </div>
        )}

        {activeTab === "moderation" && (
          <ModerationActionsLog actions={data.recentModActions} fullWidth />
        )}

        {activeTab === "suspicious" && (
          <SuspiciousActivityPanel signals={data.suspiciousActivity} />
        )}
      </div>
    </div>
  );
}
