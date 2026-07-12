"use client";

import React, { useState } from "react";
import { WorkspaceStateProvider } from "@/providers/WorkspaceStateProvider";
import { WorkspaceState } from "@/components/workspace-state/WorkspaceState";
import { Button } from "@/components/primitives/Button";

export default function WorkspaceStatesPlayground() {
  const [compactMode, setCompactMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  const emptyCards = Array.from({ length: 200 }).map((_, i) => i);
  const skeletonCards = Array.from({ length: 100 }).map((_, i) => i);

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Controls */}
      <div className="bg-white border-b border-gray-200 p-4 shrink-0 shadow-sm z-50 sticky top-0">
        <h1 className="text-xl font-bold mb-4 text-navy">Workspace States Platform Playground</h1>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
            />
            <span className="text-sm">Compact Mode</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fullscreen}
              onChange={(e) => setFullscreen(e.target.checked)}
            />
            <span className="text-sm">Fullscreen Styles</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isRTL} onChange={(e) => setIsRTL(e.target.checked)} />
            <span className="text-sm">RTL Mode</span>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 space-y-12">
        {/* 1. Empty States */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            1. Empty States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkspaceStateProvider defaultCompactMode={compactMode} defaultFullscreen={fullscreen}>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="empty" emptyProps={{ variant: "no-data" }} />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState
                  state="empty"
                  emptyProps={{ variant: "no-results", action: <Button>Clear Filters</Button> }}
                />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState
                  state="empty"
                  emptyProps={{ variant: "first-time", action: <Button>Create Item</Button> }}
                />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="empty" emptyProps={{ variant: "search-empty" }} />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="empty" emptyProps={{ variant: "coming-soon" }} />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="empty" emptyProps={{ variant: "archived" }} />
              </div>
            </WorkspaceStateProvider>
          </div>
        </section>

        {/* 2. Error States */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            2. Error States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkspaceStateProvider defaultCompactMode={compactMode} defaultFullscreen={fullscreen}>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState
                  state="error"
                  errorProps={{ variant: "generic", onRetry: () => alert("Retrying...") }}
                />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState
                  state="error"
                  errorProps={{ variant: "network", onRetry: () => alert("Retrying...") }}
                />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="error" errorProps={{ variant: "permission-placeholder" }} />
              </div>
            </WorkspaceStateProvider>
          </div>
        </section>

        {/* 3. Offline & Permission & Maintenance States */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            3. Offline, Permission & Maintenance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkspaceStateProvider defaultCompactMode={compactMode} defaultFullscreen={fullscreen}>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState
                  state="offline"
                  offlineProps={{ action: <Button>Refresh</Button> }}
                />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="permission" permissionProps={{ variant: "read-only" }} />
              </div>
              <div className="h-64 border border-gray-200 rounded-xl bg-white overflow-hidden">
                <WorkspaceState state="maintenance" maintenanceProps={{ variant: "scheduled" }} />
              </div>
            </WorkspaceStateProvider>
          </div>
        </section>

        {/* 4. Loading States & Skeletons */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            4. Loading States & Skeletons
          </h2>
          <div className="space-y-8">
            <WorkspaceStateProvider defaultCompactMode={compactMode} defaultFullscreen={fullscreen}>
              <div>
                <h3 className="text-xs text-gray-400 mb-2">Spinner</h3>
                <div className="h-32 border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <WorkspaceState state="loading" loadingProps={{ variant: "spinner" }} />
                </div>
              </div>
              <div>
                <h3 className="text-xs text-gray-400 mb-2">Inline</h3>
                <div className="p-4 border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <WorkspaceState state="loading" loadingProps={{ variant: "inline" }} />
                </div>
              </div>
              <div>
                <h3 className="text-xs text-gray-400 mb-2">Dashboard Skeleton</h3>
                <div className="p-6 border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <WorkspaceState state="loading" loadingProps={{ variant: "dashboard" }} />
                </div>
              </div>
              <div>
                <h3 className="text-xs text-gray-400 mb-2">Table Skeleton (50 rows)</h3>
                <div className="p-6 border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <WorkspaceState state="loading" loadingProps={{ variant: "table" }} />
                </div>
              </div>
            </WorkspaceStateProvider>
          </div>
        </section>

        {/* 5. Stress Tests */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            5. Stress Tests
          </h2>

          <div>
            <h3 className="text-xs text-gray-400 mb-2">100 Skeleton Cards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-xl bg-white overflow-hidden h-96 overflow-y-auto">
              <WorkspaceStateProvider
                defaultCompactMode={compactMode}
                defaultFullscreen={fullscreen}
              >
                {skeletonCards.map((i) => (
                  <WorkspaceState key={i} state="loading" loadingProps={{ variant: "card" }} />
                ))}
              </WorkspaceStateProvider>
            </div>
          </div>

          <div>
            <h3 className="text-xs text-gray-400 mb-2">
              200 Empty Placeholder Cards (Simulating layout stress)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-xl bg-white overflow-hidden h-96 overflow-y-auto">
              <WorkspaceStateProvider
                defaultCompactMode={compactMode}
                defaultFullscreen={fullscreen}
              >
                {emptyCards.map((i) => (
                  <div key={i} className="h-32 border border-gray-200 rounded-lg p-2">
                    <WorkspaceState state="empty" emptyProps={{ variant: "no-data" }} />
                  </div>
                ))}
              </WorkspaceStateProvider>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
