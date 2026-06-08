import React from "react";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 flex flex-col h-full animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-200 rounded-lg shrink-0" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md" />
            <div className="h-4 w-64 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* KPI Stats Skeleton */}
      <div className="shrink-0 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between h-[74px]"
            >
              <div className="space-y-2 w-full mr-4">
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
                <div className="h-6 w-12 bg-gray-200 rounded-md" />
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0" />
            </div>
          ))}
        </div>

        {/* Lifecycle Card Skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[130px] flex flex-col justify-between">
          <div className="h-4 w-40 bg-gray-200 rounded-md mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded-full mb-3" />
          <div className="flex items-center justify-between mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Dashboard Skeleton */}
      <div className="flex-1 min-h-[500px]">
        <div className="space-y-6 flex flex-col h-full min-h-[calc(100vh-250px)] relative">
          <div className="pb-4 pt-2 -mt-2">
            <div className="flex flex-col gap-4">
              {/* Quick Filters */}
              <div className="flex items-center gap-2 overflow-x-hidden pb-2 shrink-0">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-8 w-28 bg-gray-200 rounded-full shrink-0" />
                ))}
              </div>

              {/* Search & Actions Bar */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 shrink-0 flex flex-col gap-4">
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded-md mb-1.5" />
                  <div className="h-3 w-64 bg-gray-200 rounded-md" />
                </div>
                <div className="w-full max-w-xl h-[38px] bg-gray-200 rounded-lg" />
                <div className="h-3 w-32 bg-gray-200 rounded-md" />
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="flex-1 overflow-hidden min-h-[400px]">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {[...Array(8)].map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <div className="h-3 bg-gray-200 rounded w-20" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...Array(5)].map((_, i) => (
                      <tr key={`row-${i}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                            <div className="space-y-2">
                              <div className="h-3.5 bg-gray-200 rounded w-24" />
                              <div className="h-2.5 bg-gray-200 rounded w-32" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-5 bg-gray-200 rounded w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-5 bg-gray-200 rounded w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-5 bg-gray-200 rounded w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-8" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-20" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="h-4 bg-gray-200 rounded w-12 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
