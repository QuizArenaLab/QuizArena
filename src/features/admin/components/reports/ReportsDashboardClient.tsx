"use client";

import { useState, useCallback, useEffect } from "react";
import { Shield, MoreVertical, RefreshCw } from "lucide-react";
import type { ReportsDashboardData, ReportData, ReportFilters } from "@/types/reports";
import { ReportsSummaryCards } from "./ReportsSummaryCards";
import { ReportsTable } from "./ReportsTable";
import { ReportInvestigationDrawer } from "./ReportInvestigationDrawer";
import { ReportsFilterBar } from "./ReportsFilterBar";
import { ModerationActivityFeed } from "./ModerationActivityFeed";
import { AbuseIntelligencePanel } from "./AbuseIntelligencePanel";
import { HighPriorityCases } from "./HighPriorityCases";
import { LiveSyncStatus } from "./LiveSyncStatus";
import { QuickActionsBar } from "./QuickActionsBar";
import { ReportAgingTracker } from "./ReportAgingTracker";

interface ReportsDashboardClientProps {
  initialData: ReportsDashboardData;
}

export function ReportsDashboardClient({ initialData }: ReportsDashboardClientProps) {
  const [data, setData] = useState<ReportsDashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Table state
  const [activeFilters, setActiveFilters] = useState<ReportFilters>({});
  const [filteredReports, setFilteredReports] = useState<ReportData[]>(initialData.recentReports);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  const handleRefresh = useCallback(
    async (isAuto = false) => {
      if (!isAuto) setIsRefreshing(true);
      try {
        const { getReportsDashboardData } =
          await import("@/features/admin/reports/services/reports.service");
        const freshData = await getReportsDashboardData();
        setData(freshData);
        setLastRefreshed(new Date());

        // Re-trigger fetchModerationQueue
        const { fetchModerationQueue } =
          await import("@/features/admin/reports/services/reports.service");
        const results = await fetchModerationQueue(activeFilters);
        setFilteredReports(results);
      } catch (error) {
        console.error("Failed to refresh reports data:", error);
      } finally {
        if (!isAuto) setIsRefreshing(false);
      }
    },
    [activeFilters]
  );

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const handleFilterApply = useCallback(async (filters: ReportFilters) => {
    setActiveFilters(filters);
    setIsLoadingQueue(true);
    try {
      const { fetchModerationQueue } =
        await import("@/features/admin/reports/services/reports.service");
      const results = await fetchModerationQueue(filters);
      setFilteredReports(results);
    } catch (error) {
      console.error("Failed to filter reports:", error);
    } finally {
      setIsLoadingQueue(false);
    }
  }, []);

  const handleQuickFilterChange = useCallback(
    (status: string | null, priority: string | null) => {
      const newFilters: ReportFilters = { ...activeFilters };
      if (status) newFilters.status = status as any;
      else delete newFilters.status;

      if (priority) newFilters.priority = priority as any;
      else delete newFilters.priority;

      handleFilterApply(newFilters);
    },
    [activeFilters, handleFilterApply]
  );

  const handleOpenInvestigation = useCallback((report: ReportData) => {
    setSelectedReport(report);
  }, []);

  const handleCloseInvestigation = useCallback(() => {
    setSelectedReport(null);
  }, []);

  const handleModerationComplete = useCallback(() => {
    handleCloseInvestigation();
    handleRefresh(false);
  }, [handleCloseInvestigation, handleRefresh]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-red-700 to-red-500 rounded-xl shadow-lg shadow-red-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0A1C40]">Moderation Command Center</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review reports, investigate abuse, and protect platform integrity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LiveSyncStatus lastUpdated={lastRefreshed} isSyncing={isRefreshing} />

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleRefresh(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Manual Refresh
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionsBar statusCounts={data.statusCounts} onFilterChange={handleQuickFilterChange} />

      {/* KPI Section */}
      <ReportsSummaryCards
        summary={data.summary}
        onFilterClick={(filters) => handleFilterApply({ ...activeFilters, ...filters })}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Moderation Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[600px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <ReportsFilterBar
                filters={activeFilters}
                statusCounts={data.statusCounts}
                onApply={handleFilterApply}
              />
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/30">
              {isLoadingQueue ? (
                <div className="p-8 flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1C40]"></div>
                </div>
              ) : (
                <ReportsTable
                  reports={filteredReports}
                  onInvestigate={handleOpenInvestigation}
                  platformHealth={data.platformHealth}
                  summary={data.summary}
                  totalOpen={data.statusCounts.OPEN}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence & Prioritization */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[calc(100vh-320px)] min-h-[600px] overflow-y-auto pr-1">
          <HighPriorityCases
            reports={data.highPriorityReports}
            onInvestigate={handleOpenInvestigation}
          />

          <ReportAgingTracker metrics={data.agingMetrics} />

          <AbuseIntelligencePanel intelligence={data.abuseIntelligence} />
        </div>
      </div>

      {/* Bottom Section: Full Width Activity Log */}
      <div className="w-full">
        <ModerationActivityFeed actions={data.recentModActions} />
      </div>

      {/* Investigation Drawer */}
      {selectedReport && (
        <ReportInvestigationDrawer
          report={selectedReport}
          onClose={handleCloseInvestigation}
          onActionComplete={handleModerationComplete}
        />
      )}
    </div>
  );
}
