"use client";

import React, { useState } from "react";
import { Shield, Clock, AlertTriangle, CheckCircle2, Activity, Archive, Ban } from "lucide-react";
import {
  moveToMonitoring,
  requestRefresh,
  archiveQuestion,
  forceActive,
  dismissSignal,
} from "../../services/question-bank/governance-actions";

export function GovernancePanel({ question }: { question: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (actionFn: any, reason: string, ...args: any[]) => {
    try {
      setLoading(true);
      setError("");
      await actionFn(question.id, reason, ...args);
      alert("Action completed successfully");
    } catch (e: any) {
      setError(e.message || "Failed to complete action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Governance Status
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Lifecycle State
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {question.lifecycleState || "INSUFFICIENT_DATA"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Governance Score
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {question.governanceScore ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Freshness
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {question.freshnessStatus ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Retirement Risk
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {question.retirementRisk ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={loading}
          onClick={() => handleAction(moveToMonitoring, "Admin manually moved to monitoring")}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Activity className="w-4 h-4" /> Move to Monitoring
        </button>
        <button
          disabled={loading}
          onClick={() => handleAction(requestRefresh, "Admin requested content refresh")}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Clock className="w-4 h-4" /> Request Refresh
        </button>
        <button
          disabled={loading}
          onClick={() => handleAction(forceActive, "Admin forced question to active")}
          className="px-4 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" /> Force Active
        </button>
        <button
          disabled={loading}
          onClick={() => handleAction(archiveQuestion, "Admin archived question")}
          className="px-4 py-2 bg-white border border-rose-200 rounded-lg text-sm font-semibold text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Archive className="w-4 h-4" /> Archive Question
        </button>
      </div>
    </div>
  );
}
