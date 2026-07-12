"use client";

import React from "react";
import {
  StatisticCard,
  MetricCard,
  TrendIndicator,
  DeltaIndicator,
  ComparisonBadge,
  SparklinePlaceholder,
  KPIPlaceholder,
} from "../../../../../components/kpi";
import {
  MetricFormat,
  KPITrend,
  TrendVariant,
  ComparisonType,
  SparklineVariant,
  KPIStatus,
} from "../../../../../kpi";
import {
  DashboardGrid,
  DashboardColumn,
  DashboardRow,
  DashboardCell,
} from "../../../../../components/dashboard";

export default function KPIPlayground() {
  const dummyMetric = { value: 12450, format: MetricFormat.NUMBER };
  const dummyPercent = { value: 0.125, format: MetricFormat.PERCENT };
  const dummyCurrency = { value: 45000.5, format: MetricFormat.CURRENCY, prefix: "$" };

  const dummyStatistic = {
    metric: dummyCurrency,
    label: "Total Revenue",
    description: "Revenue generated this month.",
    trend: KPITrend.UP,
    delta: { value: 1200, format: MetricFormat.CURRENCY, prefix: "$" },
  };

  return (
    <div className="p-8 bg-[var(--color-bg-subtle, #f3f4f6)] min-h-screen text-[var(--color-text-primary, #111827)] font-sans space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">KPI Library Showcase</h1>
        <p className="text-gray-600">Enterprise KPI presentation primitives.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">1. Core Cards</h2>
        <DashboardGrid columns={3}>
          <DashboardRow>
            <DashboardCell>
              <MetricCard metric={dummyMetric} label="Total Users" />
            </DashboardCell>
            <DashboardCell>
              <StatisticCard statistic={dummyStatistic} />
            </DashboardCell>
            <DashboardCell>
              <StatisticCard
                statistic={{
                  ...dummyStatistic,
                  label: "Conversion Rate",
                  metric: dummyPercent,
                  trend: KPITrend.DOWN,
                  description: "Down from last week",
                }}
              />
            </DashboardCell>
          </DashboardRow>
        </DashboardGrid>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">2. Status & Placeholders</h2>
        <DashboardGrid columns={4}>
          <DashboardRow>
            <DashboardCell>
              <KPIPlaceholder status={KPIStatus.LOADING} />
            </DashboardCell>
            <DashboardCell>
              <KPIPlaceholder status={KPIStatus.EMPTY} />
            </DashboardCell>
            <DashboardCell>
              <KPIPlaceholder status={KPIStatus.UNAVAILABLE} />
            </DashboardCell>
            <DashboardCell>
              <KPIPlaceholder status={KPIStatus.ERROR} />
            </DashboardCell>
          </DashboardRow>
        </DashboardGrid>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">3. Trend & Delta Indicators</h2>
        <div className="flex flex-wrap gap-8 items-center bg-white p-6 rounded shadow-sm">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-500">Arrows</h3>
            <div className="flex space-x-4">
              <TrendIndicator trend={KPITrend.UP} variant={TrendVariant.ARROW} />
              <TrendIndicator trend={KPITrend.DOWN} variant={TrendVariant.ARROW} />
              <TrendIndicator trend={KPITrend.NEUTRAL} variant={TrendVariant.ARROW} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-500">Chevrons</h3>
            <div className="flex space-x-4">
              <TrendIndicator trend={KPITrend.UP} variant={TrendVariant.CHEVRON} />
              <TrendIndicator trend={KPITrend.DOWN} variant={TrendVariant.CHEVRON} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-500">Deltas</h3>
            <div className="flex space-x-4">
              <DeltaIndicator delta={{ value: 12.5, format: MetricFormat.NUMBER }} />
              <DeltaIndicator delta={{ value: -5.2, format: MetricFormat.NUMBER }} />
              <DeltaIndicator delta={{ value: 0, format: MetricFormat.NUMBER }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">4. Comparison Badges</h2>
        <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded shadow-sm">
          <ComparisonBadge type={ComparisonType.ABSOLUTE}>Absolute: 10K</ComparisonBadge>
          <ComparisonBadge type={ComparisonType.RELATIVE}>Relative: +15%</ComparisonBadge>
          <ComparisonBadge type={ComparisonType.BASELINE}>vs Baseline</ComparisonBadge>
          <ComparisonBadge type={ComparisonType.TARGET}>vs Target</ComparisonBadge>
          <ComparisonBadge type={ComparisonType.PREVIOUS}>vs Previous</ComparisonBadge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">5. Sparkline Placeholders</h2>
        <DashboardGrid columns={4}>
          <DashboardRow>
            <DashboardCell>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="text-sm mb-4">Line</h3>
                <SparklinePlaceholder
                  points={[10, 20, 15, 40, 30, 60, 50]}
                  variant={SparklineVariant.LINE}
                />
              </div>
            </DashboardCell>
            <DashboardCell>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="text-sm mb-4">Bar</h3>
                <SparklinePlaceholder
                  points={[10, 20, 15, 40, 30, 60, 50]}
                  variant={SparklineVariant.BAR}
                  color="var(--color-success)"
                />
              </div>
            </DashboardCell>
          </DashboardRow>
        </DashboardGrid>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          6. Stress Test (24 Metric Cards)
        </h2>
        <DashboardGrid columns={6}>
          <DashboardRow>
            {Array.from({ length: 24 }).map((_, i) => (
              <DashboardCell key={i}>
                <MetricCard
                  metric={{ value: 100 + ((i * 45) % 900), format: MetricFormat.NUMBER }}
                  label={`Metric ${i + 1}`}
                />
              </DashboardCell>
            ))}
          </DashboardRow>
        </DashboardGrid>
      </section>
    </div>
  );
}
