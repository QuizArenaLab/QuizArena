"use client";

import React, { useState } from "react";
import { DashboardBuilderProvider } from "@/providers/DashboardBuilderProvider";
import { DashboardBuilderMode } from "@/dashboard-builder/types";
import {
  ExecutiveLayoutTemplate,
  AnalyticsLayoutTemplate,
  BlankLayoutTemplate,
  DenseLayoutTemplate,
} from "@/dashboard-builder/templates";
import {
  DashboardBuilder,
  DashboardBuilderToolbar,
  DashboardZone,
  WidgetSlot,
  WidgetHost,
  DashboardSection,
} from "@/components/dashboard-builder";

// Dummy Widgets to populate the playground
const DummyKPI = ({ title, value }: { title: string; value: string }) => (
  <div className="w-full h-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-center">
    <div className="text-sm text-gray-500 font-medium mb-1">{title}</div>
    <div className="text-3xl font-bold text-navy">{value}</div>
  </div>
);

const DummyChart = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
    <div className="text-sm font-semibold text-navy mb-4">{title}</div>
    <div className="flex-1 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
      Chart Area
    </div>
  </div>
);

export default function DashboardBuilderPlayground() {
  const [mode, setMode] = useState<DashboardBuilderMode>("VIEW");
  const [layoutType, setLayoutType] = useState<"executive" | "analytics" | "blank" | "dense">(
    "executive"
  );

  const renderLayout = () => {
    switch (layoutType) {
      case "executive":
        return (
          <DashboardBuilder layout={ExecutiveLayoutTemplate.layout}>
            {/* Using DashboardSection and Zones just as architectural wrappers to demonstrate composition */}
            <DashboardSection id="executive-summary" title="Executive Summary">
              <DashboardZone id="summary-zone">
                <WidgetSlot id="slot-1" colSpan={3} rowSpan={1}>
                  <WidgetHost id="kpi-1">
                    <DummyKPI title="Total Revenue" value="$4.2M" />
                  </WidgetHost>
                </WidgetSlot>
                <WidgetSlot id="slot-2" colSpan={3} rowSpan={1}>
                  <WidgetHost id="kpi-2">
                    <DummyKPI title="Active Users" value="124K" />
                  </WidgetHost>
                </WidgetSlot>
                <WidgetSlot id="slot-3" colSpan={3} rowSpan={1}>
                  <WidgetHost id="kpi-3">
                    <DummyKPI title="Churn Rate" value="1.2%" />
                  </WidgetHost>
                </WidgetSlot>
                <WidgetSlot id="slot-4" colSpan={3} rowSpan={1}>
                  <WidgetHost id="kpi-4">
                    <DummyKPI title="Avg. Score" value="84.5" />
                  </WidgetHost>
                </WidgetSlot>
              </DashboardZone>
            </DashboardSection>

            <DashboardSection id="executive-charts">
              <DashboardZone id="regional-zone">
                <WidgetSlot id="slot-5" colSpan={6} rowSpan={2}>
                  <WidgetHost id="chart-1">
                    <DummyChart title="Revenue by Region" />
                  </WidgetHost>
                </WidgetSlot>
                <WidgetSlot id="slot-6" colSpan={6} rowSpan={2}>
                  <WidgetHost id="chart-2">
                    <DummyChart title="User Growth Trend" />
                  </WidgetHost>
                </WidgetSlot>
              </DashboardZone>
            </DashboardSection>
          </DashboardBuilder>
        );

      case "analytics":
        return (
          <DashboardBuilder layout={AnalyticsLayoutTemplate.layout}>
            <DashboardZone id="hero-zone">
              <WidgetSlot id="a-slot-1" colSpan={4} rowSpan={1}>
                <WidgetHost id="a-kpi-1">
                  <DummyKPI title="Sessions" value="1,402,291" />
                </WidgetHost>
              </WidgetSlot>
              <WidgetSlot id="a-slot-2" colSpan={4} rowSpan={1}>
                <WidgetHost id="a-kpi-2">
                  <DummyKPI title="Conversion" value="3.4%" />
                </WidgetHost>
              </WidgetSlot>
              <WidgetSlot id="a-slot-3" colSpan={4} rowSpan={1}>
                <WidgetHost id="a-kpi-3">
                  <DummyKPI title="Bounce Rate" value="41.2%" />
                </WidgetHost>
              </WidgetSlot>
            </DashboardZone>

            <DashboardZone id="main-charts-zone">
              <WidgetSlot id="a-slot-4" colSpan={8} rowSpan={3}>
                <WidgetHost id="a-chart-1">
                  <DummyChart title="Daily Active Users (30 Days)" />
                </WidgetHost>
              </WidgetSlot>
              <WidgetSlot id="a-slot-5" colSpan={4} rowSpan={3}>
                <WidgetHost id="a-chart-2">
                  <DummyChart title="Device Breakdown" />
                </WidgetHost>
              </WidgetSlot>
            </DashboardZone>
          </DashboardBuilder>
        );

      case "dense":
        return (
          <DashboardBuilder layout={DenseLayoutTemplate.layout}>
            <DashboardZone id="grid-zone">
              {Array.from({ length: 24 }).map((_, i) => (
                <WidgetSlot key={i} id={`d-slot-${i}`} colSpan={3} rowSpan={3}>
                  <WidgetHost id={`d-kpi-${i}`}>
                    <DummyKPI
                      title={`Metric ${i + 1}`}
                      value={`${Math.floor(Math.random() * 1000)}`}
                    />
                  </WidgetHost>
                </WidgetSlot>
              ))}
            </DashboardZone>
          </DashboardBuilder>
        );

      case "blank":
        return (
          <DashboardBuilder layout={BlankLayoutTemplate.layout}>
            <DashboardZone id="empty-zone">
              {/* Empty slots to show the placeholder UI when in edit mode */}
              <WidgetSlot id="b-slot-1" colSpan={4} rowSpan={2}></WidgetSlot>
              <WidgetSlot id="b-slot-2" colSpan={4} rowSpan={2}></WidgetSlot>
              <WidgetSlot id="b-slot-3" colSpan={4} rowSpan={2}></WidgetSlot>
            </DashboardZone>
          </DashboardBuilder>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Playground Controls */}
      <div className="bg-white border-b border-gray-200 p-4 shrink-0 shadow-sm z-50 sticky top-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy">Dashboard Builder Platform Playground</h1>
          <p className="text-sm text-gray-500">Pure presentation and composition layer.</p>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="executive">Executive Layout</option>
            <option value="analytics">Analytics Layout</option>
            <option value="dense">Dense Layout (Stress Test)</option>
            <option value="blank">Blank Layout (Empty Slots)</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as DashboardBuilderMode)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="VIEW">VIEW Mode</option>
            <option value="EDIT">EDIT Mode</option>
            <option value="PREVIEW">PREVIEW Mode</option>
            <option value="LOCKED">LOCKED Mode</option>
          </select>
        </div>
      </div>

      {/* Main Builder Container */}
      <div className="flex-1 w-full relative">
        <DashboardBuilderProvider defaultMode={mode}>
          {/* We use a key to force re-render when switching layouts/modes from playground controls */}
          <div key={`${layoutType}-${mode}`} className="w-full h-full flex flex-col">
            <DashboardBuilderToolbar />
            <div className="flex-1">{renderLayout()}</div>
          </div>
        </DashboardBuilderProvider>
      </div>
    </div>
  );
}
