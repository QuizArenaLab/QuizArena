"use client";

import { Workflow, PlayCircle, Zap, ShieldQuestion } from "lucide-react";
import { RecoveryWorkflow } from "@/types/super-admin-disaster-recovery";

interface RecoveryWorkflowsProps {
  workflows: RecoveryWorkflow[];
}

export function RecoveryWorkflows({ workflows }: RecoveryWorkflowsProps) {
  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Recovery Workflows</h2>
          <p className="text-sm text-slate-400">Structured operational recovery pipelines</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <Workflow className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-slate-300">Runbooks</span>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 hover:bg-slate-800/40 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-950/30 border border-blue-900/50 flex items-center justify-center shrink-0">
                    <ShieldQuestion className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-200">{workflow.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xl">{workflow.description}</p>

                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Trigger Event
                        </p>
                        <div className="flex items-center gap-2 text-sm text-amber-400/90">
                          <Zap className="w-3.5 h-3.5" />
                          {workflow.triggerEvent}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Estimated Time
                        </p>
                        <p className="text-sm text-slate-300">{workflow.estimatedRecoveryTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Recommended Action
                  </span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors shadow-lg shadow-blue-900/20">
                    <PlayCircle className="w-4 h-4" />
                    {workflow.recommendedAction}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
