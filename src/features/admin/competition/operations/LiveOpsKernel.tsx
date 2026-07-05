"use client";

import React, { useState } from "react";
import { CompetitionLifecycle } from "@/generated/prisma";
import { updateCompetitionLifecycleAction } from "@/competitions/actions/operations.actions";
import { Play, Pause, Square, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface LiveOpsKernelProps {
  competitionSlug: string;
  initialState: CompetitionLifecycle;
}

export function LiveOpsKernel({ competitionSlug, initialState }: LiveOpsKernelProps) {
  const [currentState, setCurrentState] = useState<CompetitionLifecycle>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransition = async (newState: CompetitionLifecycle) => {
    setIsProcessing(true);
    try {
      const res = await updateCompetitionLifecycleAction(competitionSlug, newState, "admin"); // admin placeholder
      if (res.success && res.data) {
        setCurrentState(res.data.lifecycleState);
        toast.success(`Competition state changed to ${newState}`);
      } else {
        toast.error(res.error || "Failed to update state.");
      }
    } catch (err) {
      toast.error("Unexpected error during transition.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = () => {
    switch (currentState) {
      case "LIVE": return "bg-green-100 text-green-700 border-green-200";
      case "PAUSED": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "COMPLETED": return "bg-gray-100 text-gray-700 border-gray-200";
      case "READY": return "bg-blue-100 text-blue-700 border-blue-200";
      case "SCHEDULED": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-navy" />
          <h3 className="font-bold text-navy">Live Operations Kernel</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor()}`}>
          {currentState}
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-6">
          Manually override the competition lifecycle. Use with caution.
        </p>

        <div className="flex flex-wrap gap-4">
          {(currentState === "READY" || currentState === "SCHEDULED" || currentState === "PAUSED") && (
            <button
              onClick={() => handleTransition(CompetitionLifecycle.LIVE)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Force Start / Resume
            </button>
          )}

          {currentState === "LIVE" && (
            <button
              onClick={() => handleTransition(CompetitionLifecycle.PAUSED)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
              Force Pause
            </button>
          )}

          {(currentState === "LIVE" || currentState === "PAUSED") && (
            <button
              onClick={() => handleTransition(CompetitionLifecycle.COMPLETED)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
              End Early
            </button>
          )}

          {currentState === "COMPLETED" && (
            <p className="text-gray-500 text-sm font-semibold">Competition has ended. No further operations available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
