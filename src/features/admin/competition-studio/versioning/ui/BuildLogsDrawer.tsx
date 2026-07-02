"use client";

import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface BuildLogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: { timestamp: string; stage: string; message: string; durationMs?: number }[];
  status: 'IDLE' | 'BUILDING' | 'SUCCESS' | 'FAILED';
  version?: string;
}

export function BuildLogsDrawer({ isOpen, onClose, logs, status, version }: BuildLogsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div 
        className="w-full bg-white rounded-t-xl max-h-[80vh] flex flex-col p-6 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-zinc-500 hover:text-black" onClick={onClose}>✕</button>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Version Build Logs
                {status === 'BUILDING' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                {status === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {status === 'FAILED' && <AlertCircle className="w-4 h-4 text-red-500" />}
              </h2>
              <p className="text-zinc-500 text-sm">
                {version ? `Artifact build pipeline for version ${version}` : 'Executing build pipeline...'}
              </p>
            </div>
            <Badge variant={status === 'SUCCESS' ? 'default' : status === 'FAILED' ? 'destructive' : 'secondary'}>
              {status}
            </Badge>
          </div>
        </div>

        <div className="flex-1 p-4 bg-zinc-950 text-zinc-300 font-mono text-sm overflow-auto rounded-md border border-zinc-800">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-600 min-h-[300px]">
              Awaiting pipeline execution...
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 border-b border-zinc-800/50 pb-2">
                  <span className="text-zinc-500 shrink-0">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <Badge variant="outline" className="shrink-0 w-fit">
                    {log.stage}
                  </Badge>
                  <span className="text-zinc-300 wrap-break-word flex-1">
                    {log.message}
                  </span>
                  {log.durationMs !== undefined && (
                    <span className="text-zinc-500 shrink-0 flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      {log.durationMs}ms
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
