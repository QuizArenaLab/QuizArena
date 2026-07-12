"use client";

import React, { useState } from "react";
import { DashboardGrid, DashboardRow, DashboardCell } from "../../../../../components/dashboard";
import { Widget, WidgetGridItem } from "../../../../../components/widget";
import {
  createWidgetManifest,
  WidgetCategory,
  WidgetSize,
  WidgetState,
} from "../../../../../widget";

const kpiManifest = createWidgetManifest(
  {
    id: "kpi-rev",
    name: "Total Revenue",
    description: "Monthly recurring revenue",
    category: WidgetCategory.KPI,
    defaultSize: WidgetSize.SM,
  },
  { defaultColumns: 1 },
  { supportsFooter: true }
);

const chartManifest = createWidgetManifest(
  {
    id: "chart-mrr",
    name: "MRR Growth",
    description: "Trailing 6 months",
    category: WidgetCategory.CHART,
    defaultSize: WidgetSize.MD,
  },
  { defaultColumns: 2, minHeight: 300 },
  {}
);

const statManifest = createWidgetManifest(
  {
    id: "stat-users",
    name: "Active Users",
    description: "Daily active users",
    category: WidgetCategory.SUMMARY,
    defaultSize: WidgetSize.SM,
  },
  { defaultColumns: 1 },
  {}
);

const tableManifest = createWidgetManifest(
  {
    id: "table-recent",
    name: "Recent Transactions",
    description: "Latest user purchases",
    category: WidgetCategory.TABLE,
    defaultSize: WidgetSize.LG,
  },
  { defaultColumns: 3, minHeight: 400 },
  {}
);

const chartData = {
  points: [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
  ],
  series: [{ dataKey: "value", name: "MRR" }],
};

export default function WidgetsPlayground() {
  const [globalState, setGlobalState] = useState<WidgetState>(WidgetState.READY);

  return (
    <div className="p-8 min-h-screen font-sans space-y-12 bg-[var(--color-bg-subtle, #f3f4f6)] text-[var(--color-text-primary, #111827)]">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Enterprise Widget Library</h1>
          <p className="opacity-75">
            Strict composition of Dashboard, KPI, and Chart primitives. Zero business logic.
          </p>
        </div>
        <div className="flex space-x-2 gap-2 flex-wrap items-center bg-black/5 p-2 rounded-lg">
          <select
            value={globalState}
            onChange={(e) => setGlobalState(e.target.value as WidgetState)}
            className="text-sm p-1 rounded text-black ml-2"
          >
            {Object.values(WidgetState).map((state) => (
              <option key={state} value={state}>
                Global State: {state}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          1. Executive Dashboard (Mixed Composition)
        </h2>
        <DashboardGrid columns={4}>
          <DashboardRow>
            <WidgetGridItem manifest={kpiManifest}>
              <Widget
                manifest={kpiManifest}
                initialState={globalState}
                data={{
                  value: "$45,231",
                  trend: "+12%",
                  trendType: "up",
                  comparison: "vs last month",
                }}
                options={{ footerText: "Updated just now" }}
              />
            </WidgetGridItem>
            <WidgetGridItem manifest={kpiManifest}>
              <Widget
                manifest={{
                  ...kpiManifest,
                  metadata: { ...kpiManifest.metadata, name: "New Customers" },
                }}
                initialState={globalState}
                data={{
                  value: "1,204",
                  trend: "-2%",
                  trendType: "down",
                  comparison: "vs last month",
                }}
              />
            </WidgetGridItem>
            <WidgetGridItem manifest={chartManifest}>
              <Widget
                manifest={chartManifest}
                initialState={globalState}
                data={chartData}
                options={{ xAxis: { dataKey: "name" } }}
              />
            </WidgetGridItem>
          </DashboardRow>
          <DashboardRow>
            <WidgetGridItem manifest={tableManifest}>
              <Widget manifest={tableManifest} initialState={globalState} />
            </WidgetGridItem>
            <WidgetGridItem manifest={statManifest}>
              <Widget manifest={statManifest} initialState={globalState} />
            </WidgetGridItem>
          </DashboardRow>
        </DashboardGrid>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          2. Stress Test (50 KPI Widgets)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}>
              <Widget
                manifest={kpiManifest}
                initialState={globalState}
                data={{ value: 1000 + i * 100 }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
