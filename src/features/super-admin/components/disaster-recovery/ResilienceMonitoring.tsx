"use client";

import { Activity, Server, Clock, AlertCircle } from "lucide-react";
import { ServiceHealth } from "@/types/super-admin-disaster-recovery";

interface ResilienceMonitoringProps {
  services: ServiceHealth[];
}

export function ResilienceMonitoring({ services }: ResilienceMonitoringProps) {
  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Infrastructure Resilience</h2>
          <p className="text-sm text-slate-400">Proactive survivability awareness</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-300">Live Health</span>
        </div>
      </div>

      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-3">Critical Service</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Uptime</th>
              <th className="px-6 py-3">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {services.map((service) => (
              <tr key={service.serviceId} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        service.status === "ONLINE"
                          ? "bg-emerald-950/30 text-emerald-500 border border-emerald-900/50"
                          : service.status === "DEGRADED"
                            ? "bg-amber-950/30 text-amber-500 border border-amber-900/50"
                            : "bg-red-950/30 text-red-500 border border-red-900/50"
                      }`}
                    >
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{service.name}</p>
                      <p className="text-xs text-slate-500">{service.serviceId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === "ONLINE"
                          ? "bg-emerald-500"
                          : service.status === "DEGRADED"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        service.status === "ONLINE"
                          ? "text-emerald-400"
                          : service.status === "DEGRADED"
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {service.uptime.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        service.responseTimeMs > 200
                          ? "text-red-400"
                          : service.responseTimeMs > 100
                            ? "text-amber-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {service.responseTimeMs} ms
                    </span>
                    {service.responseTimeMs > 200 && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
