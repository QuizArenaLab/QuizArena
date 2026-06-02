"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, RefreshCw, Radio, LayoutDashboard, Clock } from "lucide-react";
import type {
  LiveOperationsDashboardData,
  LiveParticipant,
  AntiCheatStats,
} from "@/types/live-operations";
import { ActiveChallengesGrid } from "./ActiveChallengesGrid";
import { ParticipationMonitor } from "./ParticipationMonitor";
import { AntiCheatMonitor } from "./AntiCheatMonitor";
import { ActivityTimeline } from "./ActivityTimeline";
import { OperationalAlerts } from "./OperationalAlerts";
import { InfrastructureStatusPanel } from "./InfrastructureStatusPanel";
import { GovernanceActions } from "./GovernanceActions";
import { LeaderboardMonitor } from "./LeaderboardMonitor";
import { FailureMonitor } from "./FailureMonitor";

interface LiveOperationsDashboardClientProps {
  initialData: LiveOperationsDashboardData;
  isSuperAdmin: boolean;
}

export function LiveOperationsDashboardClient({
  initialData,
  isSuperAdmin,
}: LiveOperationsDashboardClientProps) {
  const [data, setData] = useState<LiveOperationsDashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date(initialData.lastUpdated));

  const [selectedChallengeId, setSelectedChallengeId] = useState<string | undefined>(
    initialData.liveChallenges.length > 0 ? initialData.liveChallenges[0].id : undefined
  );

  const [participants, setParticipants] = useState<LiveParticipant[]>([]);
  const [antiCheatStats, setAntiCheatStats] = useState<AntiCheatStats | null>(null);

  const fetchChallengeDetails = async (challengeId: string) => {
    try {
      const { getLiveParticipants, monitorSuspiciousActivity } =
        await import("@/features/admin/services/live-operations");
      const [parts, cheatStats] = await Promise.all([
        getLiveParticipants(challengeId),
        monitorSuspiciousActivity(challengeId),
      ]);
      setParticipants(parts);
      setAntiCheatStats(cheatStats);
    } catch (e) {
      console.error("Failed to fetch challenge details", e);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { getLiveOperationsDashboardData } = await import("@/features/admin/services/live-operations");
      const freshData = await getLiveOperationsDashboardData();
      setData(freshData);
      setLastRefreshed(new Date(freshData.lastUpdated));

      if (selectedChallengeId) {
        await fetchChallengeDetails(selectedChallengeId);
      } else if (freshData.liveChallenges.length > 0) {
        setSelectedChallengeId(freshData.liveChallenges[0].id);
      }
    } catch (error) {
      console.error("Failed to refresh live ops data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedChallengeId]);

  // Initial fetch for selected challenge details
  useEffect(() => {
    if (selectedChallengeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchChallengeDetails(selectedChallengeId);
    }
  }, [selectedChallengeId]);

  // Polling every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const activeChallenge = data.liveChallenges.find((c) => c.id === selectedChallengeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 rounded-xl relative">
            <Radio className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping border-2 border-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0A1C40]">Live Operations Center</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Last updated:{" "}
              {lastRefreshed.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#0A1C40] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (Main Focus) */}
        <div className="lg:col-span-3 space-y-6">
          <ActiveChallengesGrid
            challenges={data.liveChallenges}
            onSelect={setSelectedChallengeId}
            selectedId={selectedChallengeId}
          />

          {selectedChallengeId && antiCheatStats ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
                Challenge Focus: <span className="text-secondary">{activeChallenge?.title}</span>
              </h2>

              <ParticipationMonitor participants={participants} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <AntiCheatMonitor stats={antiCheatStats} />
                </div>
                <div className="space-y-6">
                  <GovernanceActions
                    challengeId={selectedChallengeId}
                    isSuperAdmin={isSuperAdmin}
                  />
                  <LeaderboardMonitor />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm font-medium">
              Select a LIVE challenge to monitor participation and integrity.
            </div>
          )}
        </div>

        {/* Right Column (Global Operational State) */}
        <div className="space-y-6">
          <OperationalAlerts alerts={data.alerts} />
          <InfrastructureStatusPanel status={data.infrastructureStatus} />
          <FailureMonitor />
          <ActivityTimeline events={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
