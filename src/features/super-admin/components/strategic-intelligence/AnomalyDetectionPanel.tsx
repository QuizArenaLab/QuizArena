"use client";

import { BusinessAnomaly } from "@/types/super-admin-strategic";
import { AlertCircle, Clock, ShieldAlert, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface AnomalyDetectionPanelProps {
  anomalies: BusinessAnomaly[];
}

export function AnomalyDetectionPanel({ anomalies }: AnomalyDetectionPanelProps) {
  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-950/50 flex items-center justify-center border border-rose-900/50">
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
              Active Anomalies
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-950 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">{anomalies.length} Detected</span>
        </div>
      </div>

      <div className="p-0 flex-1 overflow-y-auto">
        {anomalies.length > 0 ? (
          <ul className="divide-y divide-slate-800/50">
            {anomalies.map((anomaly) => {
              const isNegative = anomaly.deviation.startsWith("-");
              const isCritical = anomaly.severity === "CRITICAL";

              return (
                <li
                  key={anomaly.id}
                  className={`p-5 transition-colors ${isCritical ? "bg-rose-950/5 hover:bg-rose-950/10" : "hover:bg-slate-900/40"}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isCritical && <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />}
                      <h3
                        className={`font-semibold ${isCritical ? "text-rose-100" : "text-slate-200"}`}
                      >
                        {anomaly.metric}
                      </h3>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-bold ${
                        isNegative
                          ? "bg-rose-950/30 border-rose-900/50 text-rose-400"
                          : "bg-amber-950/30 border-amber-900/50 text-amber-400"
                      }`}
                    >
                      {isNegative ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {anomaly.deviation}
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                    {anomaly.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Detected: {new Date(anomaly.detectedAt).toLocaleString()}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
            <ShieldAlert className="w-8 h-8 mb-3 opacity-20 text-emerald-500" />
            <p className="text-sm font-medium">No active business anomalies detected.</p>
            <p className="text-xs mt-1 text-slate-600">
              Platform metrics are operating within expected ranges.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
