import React from "react";

export default function ModerationDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Icon Box */}
          <div className="w-10 h-10 bg-red-100 rounded-xl shrink-0" />
          <div>
            {/* Title */}
            <div className="w-64 h-6 bg-gray-200 rounded-md mb-1.5" />
            {/* Subtitle */}
            <div className="w-80 h-3 bg-gray-200 rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* LiveSync Status Pill */}
          <div className="w-48 h-8 bg-gray-200 rounded-full" />
          {/* Menu Button */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="w-24 h-4 bg-gray-200 rounded-md mb-3" />
        <div className="flex flex-wrap gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[200px] h-9 bg-gray-100 border border-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-[88px] relative overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col gap-2">
                <div className="w-20 h-3 bg-gray-200 rounded-md" />
                <div className="w-10 h-7 bg-gray-300 rounded-md" />
              </div>
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Moderation Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[600px]">
            {/* Filter Bar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-16 h-[26px] bg-gray-200 rounded-lg" />
                  ))}
                </div>
                <div className="w-full sm:max-w-xs h-[38px] bg-gray-200 rounded-lg" />
              </div>

              <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-gray-100">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-24 h-[26px] bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Platform Health Empty State Mockup */}
            <div className="flex-1 bg-gray-50/30 p-6 flex flex-col justify-center items-center">
              <div className="w-full max-w-2xl bg-white border border-green-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="w-40 h-5 bg-gray-200 rounded-md" />
                    <div className="w-64 h-4 bg-gray-100 rounded-md" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 h-[72px]">
                      <div className="w-20 h-3 bg-gray-200 rounded-md mb-2" />
                      <div className="w-12 h-5 bg-gray-300 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence & Prioritization */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[calc(100vh-320px)] min-h-[600px] overflow-hidden pr-1">
          {/* High Priority Cases */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-md" />
              <div className="w-32 h-4 bg-gray-200 rounded-md" />
            </div>
            <div className="p-4 flex justify-center items-center h-[120px]">
              <div className="w-32 h-3 bg-gray-100 rounded-md" />
            </div>
          </div>

          {/* Aging Tracker */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-gray-200 rounded-md" />
              <div className="w-28 h-4 bg-gray-200 rounded-md" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-16 h-3 bg-gray-200 rounded-md" />
                  </div>
                  <div className="w-6 h-4 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-40 h-3 bg-gray-100 rounded-md" />
            </div>
          </div>

          {/* Abuse Intelligence */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-md" />
              <div className="w-32 h-4 bg-gray-200 rounded-md" />
            </div>
            <div className="p-4 space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 h-[68px]">
                  <div className="w-32 h-3 bg-gray-200 rounded-md mb-2" />
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-gray-300 rounded-md" />
                    <div className="w-12 h-4 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Full Width Activity Log */}
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-white">
          <div className="w-4 h-4 bg-gray-200 rounded-md" />
          <div className="w-48 h-4 bg-gray-200 rounded-md" />
        </div>
        <div className="p-12 flex flex-col justify-center items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl mb-3" />
          <div className="w-40 h-3 bg-gray-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}
