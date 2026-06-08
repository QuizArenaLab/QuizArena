import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-100 rounded-lg w-11 h-11 shrink-0" />
          <div className="space-y-2">
            <div className="w-64 h-6 bg-gray-200 rounded-md" />
            <div className="w-80 h-4 bg-gray-200 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Platform Health Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
          <div className="w-32 h-6 bg-gray-200 rounded-md" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[74px]"
            >
              <div className="w-24 h-3 bg-gray-200 rounded-md mb-2.5" />
              <div className="w-12 h-6 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* Moderation Queue & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-md shrink-0" />
              <div className="w-40 h-6 bg-gray-200 rounded-md" />
            </div>
            <div className="w-16 h-4 bg-gray-200 rounded-md" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[86px]"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-4 h-4 bg-gray-200 rounded-md shrink-0" />
                  <div className="w-20 h-3 bg-gray-200 rounded-md" />
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[280px]">
            <div className="w-40 h-4 bg-gray-200 rounded-md mb-5" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0" />
                    <div className="space-y-2">
                      <div className="w-48 h-4 bg-gray-200 rounded-md" />
                      <div className="w-32 h-3 bg-gray-200 rounded-md" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded-md shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
            <div className="w-32 h-6 bg-gray-200 rounded-md" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 h-[104px]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-md shrink-0" />
                  <div className="space-y-2.5 w-full">
                    <div className="w-32 h-4 bg-gray-200 rounded-md" />
                    <div className="w-full h-3 bg-gray-200 rounded-md" />
                    <div className="w-3/4 h-3 bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Moderator & User Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
            <div className="w-40 h-6 bg-gray-200 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[74px]"
              >
                <div className="w-24 h-3 bg-gray-200 rounded-md mb-2.5" />
                <div className="w-12 h-6 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[240px]">
            <div className="w-32 h-4 bg-gray-200 rounded-md mb-5" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                    <div className="space-y-2">
                      <div className="w-32 h-3.5 bg-gray-200 rounded-md" />
                      <div className="w-24 h-3 bg-gray-200 rounded-md" />
                    </div>
                  </div>
                  <div className="w-20 h-4 bg-gray-200 rounded-md shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
            <div className="w-32 h-6 bg-gray-200 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[74px]"
              >
                <div className="w-24 h-3 bg-gray-200 rounded-md mb-2.5" />
                <div className="w-12 h-6 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Engagement Trends */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
          <div className="w-48 h-6 bg-gray-200 rounded-md" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[220px]">
          <div className="grid grid-cols-7 gap-4 h-full">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="text-center flex flex-col justify-end">
                <div className="h-24 flex flex-col items-center justify-end mb-3">
                  <div
                    className="w-full bg-gray-100 rounded-t-md"
                    style={{ height: `${20 + i * 10}%` }}
                  />
                </div>
                <div className="w-8 h-3 bg-gray-200 rounded-md mx-auto mb-2" />
                <div className="w-6 h-3 bg-gray-200 rounded-md mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
          <div className="w-32 h-6 bg-gray-200 rounded-md" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[250px]">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0" />
                <div className="space-y-2">
                  <div className="w-64 h-3.5 bg-gray-200 rounded-md" />
                  <div className="w-40 h-3 bg-gray-200 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
