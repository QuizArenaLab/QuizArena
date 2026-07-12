"use client";

import React, { useState } from "react";
import {
  Chart,
  ChartHeader,
  ChartBody,
  LineChart,
  AreaChart,
  BarChart,
  StackedBarChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
  RadarChart,
  RadialChart,
  ScatterChart,
  ChartPlaceholder,
} from "../../../../../components/chart";
import { ChartDataset, VisualizationOptions, ChartState, ChartDensity } from "../../../../../chart";
import { DashboardGrid, DashboardRow, DashboardCell } from "../../../../../components/dashboard";

const dummyPoints = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const piePoints = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const radarPoints = [
  { subject: "Math", A: 120, B: 110, fullMark: 150 },
  { subject: "Chinese", A: 98, B: 130, fullMark: 150 },
  { subject: "English", A: 86, B: 130, fullMark: 150 },
  { subject: "Geography", A: 99, B: 100, fullMark: 150 },
  { subject: "Physics", A: 85, B: 90, fullMark: 150 },
  { subject: "History", A: 65, B: 85, fullMark: 150 },
];

const radialPoints = [
  { name: "18-24", uv: 31.47, pv: 2400 },
  { name: "25-29", uv: 26.69, pv: 4567 },
  { name: "30-34", uv: 15.69, pv: 1398 },
  { name: "35-39", uv: 8.22, pv: 9800 },
];

const scatterPoints = [
  { x: 10, y: 30, z: 200 },
  { x: 14, y: 50, z: 280 },
  { x: 15, y: 40, z: 500 },
  { x: 18, y: 42, z: 200 },
  { x: 20, y: 20, z: 100 },
];

export default function ChartsPlayground() {
  const [isRTL, setIsRTL] = useState(false);
  const [density, setDensity] = useState<ChartDensity>(ChartDensity.COMFORTABLE);
  const [state, setState] = useState<ChartState>(ChartState.READY);

  const defaultDataset: ChartDataset = {
    points: dummyPoints,
    series: [
      { dataKey: "uv", name: "Unique Views" },
      { dataKey: "pv", name: "Page Views" },
    ],
  };

  const pieDataset: ChartDataset = {
    points: piePoints,
    series: [{ dataKey: "value", name: "Value" }],
  };
  const radarDataset: ChartDataset = {
    points: radarPoints,
    series: [
      { dataKey: "A", name: "A" },
      { dataKey: "B", name: "B" },
    ],
  };
  const radialDataset: ChartDataset = {
    points: radialPoints,
    series: [{ dataKey: "uv", name: "UV" }],
  };
  const scatterDataset: ChartDataset = {
    points: scatterPoints,
    series: [{ dataKey: "z", name: "Group 1" }],
  };

  const defaultOptions: VisualizationOptions = {
    xAxis: { dataKey: "name" },
    yAxis: {},
    legend: { layout: "horizontal", align: "center", verticalAlign: "bottom" },
    tooltip: {},
  };

  const wrapperClass =
    "bg-[var(--color-bg-subtle, #f3f4f6)] text-[var(--color-text-primary, #111827)]";

  return (
    <div
      className={`p-8 min-h-screen font-sans space-y-12 transition-colors duration-200 ${wrapperClass}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Enterprise Chart Library</h1>
          <p className="opacity-75">
            Strictly decoupled Recharts wrappers using Factory and Engine abstractions.
          </p>
        </div>
        <div className="flex space-x-2 gap-2 flex-wrap items-center bg-black/5 p-2 rounded-lg">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" checked={isRTL} onChange={(e) => setIsRTL(e.target.checked)} />
            <span className="text-sm font-medium">RTL</span>
          </label>
          <select
            value={density}
            onChange={(e) => setDensity(e.target.value as ChartDensity)}
            className="text-sm p-1 rounded text-black ml-2"
          >
            <option value={ChartDensity.COMFORTABLE}>Comfortable</option>
            <option value={ChartDensity.COMPACT}>Compact</option>
            <option value={ChartDensity.DENSE}>Dense</option>
          </select>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as ChartState)}
            className="text-sm p-1 rounded text-black ml-2"
          >
            <option value={ChartState.READY}>Ready</option>
            <option value={ChartState.LOADING}>Loading</option>
            <option value={ChartState.EMPTY}>Empty</option>
            <option value={ChartState.ERROR}>Error</option>
            <option value={ChartState.OFFLINE}>Offline</option>
          </select>
        </div>
      </header>

      {state !== ChartState.READY ? (
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-black/10">
            State Preview: {state}
          </h2>
          <div className="h-[400px]">
            <ChartPlaceholder status={state} minHeight="100%" />
          </div>
        </section>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-black/10">
              1. Cartesian Charts
            </h2>
            <DashboardGrid columns={2}>
              <DashboardRow>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Line Chart" subtitle="Standard monotone lines" />
                    <ChartBody>
                      <LineChart dataset={defaultDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Area Chart" subtitle="Overlapping areas with opacity" />
                    <ChartBody>
                      <AreaChart dataset={defaultDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
              </DashboardRow>
              <DashboardRow>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Bar Chart" subtitle="Grouped vertical bars" />
                    <ChartBody>
                      <BarChart dataset={defaultDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Stacked Bar Chart" subtitle="Stacked vertical bars" />
                    <ChartBody>
                      <StackedBarChart dataset={defaultDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
              </DashboardRow>
              <DashboardRow>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Horizontal Bar Chart" subtitle="Horizontal orientation" />
                    <ChartBody>
                      <HorizontalBarChart dataset={defaultDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
              </DashboardRow>
            </DashboardGrid>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-black/10">
              2. Circular Charts
            </h2>
            <DashboardGrid columns={2}>
              <DashboardRow>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Pie Chart" subtitle="Standard Pie" />
                    <ChartBody>
                      <PieChart dataset={pieDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Donut Chart" subtitle="Pie with inner radius" />
                    <ChartBody>
                      <DonutChart dataset={pieDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
              </DashboardRow>
            </DashboardGrid>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-black/10">
              3. Complex Charts
            </h2>
            <DashboardGrid columns={3}>
              <DashboardRow>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Radar Chart" subtitle="Multi-dimensional" />
                    <ChartBody>
                      <RadarChart
                        dataset={radarDataset}
                        options={{ ...defaultOptions, xAxis: { dataKey: "subject" } }}
                      />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Radial Chart" subtitle="Radial Bars" />
                    <ChartBody>
                      <RadialChart dataset={radialDataset} options={defaultOptions} />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
                <DashboardCell>
                  <Chart>
                    <ChartHeader title="Scatter Chart" subtitle="XY Distribution" />
                    <ChartBody>
                      <ScatterChart
                        dataset={scatterDataset}
                        options={{
                          ...defaultOptions,
                          xAxis: { dataKey: "x" },
                          yAxis: { dataKey: "y" },
                        }}
                      />
                    </ChartBody>
                  </Chart>
                </DashboardCell>
              </DashboardRow>
            </DashboardGrid>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-black/10">
              4. Stress Test (24 Recharts Wrappers)
            </h2>
            <DashboardGrid columns={6}>
              <DashboardRow>
                {Array.from({ length: 24 }).map((_, i) => (
                  <DashboardCell key={i}>
                    <Chart>
                      <ChartBody>
                        <LineChart
                          height={120}
                          dataset={{ points: dummyPoints, series: [{ dataKey: "uv" }] }}
                          options={{
                            xAxis: { hide: true },
                            yAxis: { hide: true },
                            legend: { hide: true },
                            tooltip: { hide: true },
                          }}
                        />
                      </ChartBody>
                    </Chart>
                  </DashboardCell>
                ))}
              </DashboardRow>
            </DashboardGrid>
          </section>
        </>
      )}
    </div>
  );
}
