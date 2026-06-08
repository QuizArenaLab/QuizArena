import { Activity } from "lucide-react";

interface LiveSyncStatusProps {
  lastUpdated: Date;
  isSyncing?: boolean;
}

export function LiveSyncStatus({ lastUpdated, isSyncing = false }: LiveSyncStatusProps) {
  const timeString = lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isSyncing ? "opacity-100" : ""}`}
          ></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </div>
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
          {isSyncing ? "Syncing..." : "Sync Active"}
        </span>
      </div>
      <div className="w-px h-4 bg-gray-200"></div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Activity className="w-3.5 h-3.5" />
        <span>Updated {timeString}</span>
      </div>
    </div>
  );
}
