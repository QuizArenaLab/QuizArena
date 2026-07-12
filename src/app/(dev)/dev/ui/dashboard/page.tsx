"use client";

import React, { useState } from "react";
import {
  Dashboard,
  DashboardLayout,
  DashboardContainer,
  DashboardGrid,
  DashboardRow,
  DashboardColumn,
  DashboardCell,
  DashboardSection,
  DashboardSectionHeader,
  DashboardSectionBody,
  DashboardSectionFooter,
  DashboardHeader,
  DashboardBody,
  DashboardFooter,
  DashboardPlaceholder,
} from "../../../../../components/dashboard";
import {
  DashboardVariant,
  DashboardSlot,
  DashboardManifest,
  DashboardSectionPriority,
} from "../../../../../dashboard";

const dummyManifest: DashboardManifest = {
  metadata: {
    id: "demo-dash-01",
    name: "Playground Dashboard",
    description: "A developer playground for testing dashboard foundation.",
    owner: "DevTeam",
    version: "1.0.0",
    registryVersion: "1.0.0",
    status: "active",
  },
  capabilities: {
    supportsGrid: true,
    supportsWidgets: false,
    supportsSections: true,
    supportsCharts: false,
    supportsKPIs: false,
    supportsResponsive: true,
    supportsAccessibility: true,
    supportsRealtime: false,
    supportsExport: false,
    supportsPrinting: false,
    supportsFullscreen: false,
  },
  layout: {
    variant: DashboardVariant.DEFAULT,
    defaultSlots: [DashboardSlot.HEADER, DashboardSlot.GRID, DashboardSlot.FOOTER],
    spacing: "16px",
    columns: 12,
    compact: false,
    maxWidth: "100%",
  },
  accessibility: {
    ariaLabels: true,
    keyboardNav: true,
    reducedMotion: false,
    highContrast: false,
  },
};

export default function DashboardPlayground() {
  const [variant, setVariant] = useState<DashboardVariant>(DashboardVariant.DEFAULT);

  const getLayoutProps = () => {
    switch (variant) {
      case DashboardVariant.COMPACT:
        return { variant, spacing: "8px", columns: 12, compact: true, maxWidth: "100%" };
      case DashboardVariant.WIDE:
        return { variant, spacing: "24px", columns: 16, compact: false, maxWidth: "1600px" };
      case DashboardVariant.DENSE:
        return { variant, spacing: "4px", columns: 24, compact: true, maxWidth: "100%" };
      case DashboardVariant.EXECUTIVE:
        return { variant, spacing: "32px", columns: 12, compact: false, maxWidth: "1400px" };
      case DashboardVariant.ANALYTICS:
        return { variant, spacing: "16px", columns: 12, compact: false, maxWidth: "100%" };
      case DashboardVariant.DEFAULT:
      default:
        return { variant, spacing: "16px", columns: 12, compact: false, maxWidth: "100%" };
    }
  };

  const renderWidget = (title: string, h = 1) => (
    <div
      style={{
        backgroundColor: "var(--color-bg-surface, #fff)",
        border: "1px solid var(--color-border-subtle, #e5e7eb)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "16px",
        height: `${h * 100}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        color: "var(--color-text-secondary, #6b7280)",
      }}
    >
      {title}
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--color-bg-subtle, #f3f4f6)] text-[var(--color-text-primary, #111827)] font-sans">
      <div className="w-64 border-r border-[var(--color-border-subtle, #e5e7eb)] p-4 bg-white flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-bold text-lg">Variants</h2>
        {Object.values(DashboardVariant).map((v) => (
          <button
            key={v}
            className={`px-4 py-2 text-left rounded ${variant === v ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"}`}
            onClick={() => setVariant(v)}
          >
            {v} Dashboard
          </button>
        ))}

        <h2 className="font-bold text-lg mt-4">States</h2>
        <button
          className="px-4 py-2 text-left rounded hover:bg-gray-100"
          onClick={() => setVariant("EMPTY" as any)}
        >
          Empty Dashboard
        </button>
        <button
          className="px-4 py-2 text-left rounded hover:bg-gray-100"
          onClick={() => setVariant("LOADING" as any)}
        >
          Loading Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {(variant as any) === "EMPTY" ? (
          <Dashboard manifest={dummyManifest} layout={getLayoutProps()}>
            <DashboardContainer>
              <DashboardPlaceholder
                title="No Data Available"
                description="There are currently no metrics to display for this workspace."
              />
            </DashboardContainer>
          </Dashboard>
        ) : (variant as any) === "LOADING" ? (
          <Dashboard manifest={dummyManifest} layout={getLayoutProps()}>
            <DashboardContainer>
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                Loading widgets... (Skeleton simulation)
              </div>
            </DashboardContainer>
          </Dashboard>
        ) : (
          <Dashboard
            manifest={{ ...dummyManifest, layout: { ...dummyManifest.layout, variant } }}
            layout={getLayoutProps()}
          >
            <DashboardLayout
              header={
                <DashboardHeader
                  title={`${variant} Dashboard`}
                  subtitle="Enterprise Analytics Foundation"
                  actionsSlot={
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium">
                      Export
                    </button>
                  }
                />
              }
              grid={
                <DashboardContainer>
                  <DashboardBody>
                    <DashboardSection priority={DashboardSectionPriority.PRIMARY}>
                      <DashboardSectionHeader
                        title="Key Performance Indicators"
                        description="High-level metrics for the platform."
                      />
                      <DashboardSectionBody>
                        <DashboardGrid>
                          <DashboardRow>
                            <DashboardCell span={3}>{renderWidget("KPI 1")}</DashboardCell>
                            <DashboardCell span={3}>{renderWidget("KPI 2")}</DashboardCell>
                            <DashboardCell span={3}>{renderWidget("KPI 3")}</DashboardCell>
                            <DashboardCell span={3}>{renderWidget("KPI 4")}</DashboardCell>
                          </DashboardRow>
                        </DashboardGrid>
                      </DashboardSectionBody>
                    </DashboardSection>

                    <DashboardSection
                      priority={DashboardSectionPriority.SECONDARY}
                      className="mt-8"
                    >
                      <DashboardSectionHeader title="Trends & Analysis" />
                      <DashboardSectionBody>
                        <DashboardGrid>
                          <DashboardRow>
                            <DashboardColumn span={8}>
                              <DashboardCell h={3}>
                                {renderWidget("Main Chart Area", 3)}
                              </DashboardCell>
                            </DashboardColumn>
                            <DashboardColumn span={4}>
                              <DashboardGrid columns={1}>
                                <DashboardRow>
                                  <DashboardCell>{renderWidget("Side Widget 1")}</DashboardCell>
                                </DashboardRow>
                                <DashboardRow>
                                  <DashboardCell>{renderWidget("Side Widget 2")}</DashboardCell>
                                </DashboardRow>
                              </DashboardGrid>
                            </DashboardColumn>
                          </DashboardRow>
                        </DashboardGrid>
                      </DashboardSectionBody>
                    </DashboardSection>

                    <DashboardSection priority={DashboardSectionPriority.TERTIARY} className="mt-8">
                      <DashboardSectionHeader title="Stress Test (24 Items)" />
                      <DashboardSectionBody>
                        <DashboardGrid columns={6}>
                          <DashboardRow>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <DashboardCell key={i} span={1}>
                                {renderWidget(`Item ${i + 1}`, 0.5)}
                              </DashboardCell>
                            ))}
                          </DashboardRow>
                        </DashboardGrid>
                      </DashboardSectionBody>
                      <DashboardSectionFooter>
                        <div className="text-sm text-gray-500 text-right w-full">Footer info</div>
                      </DashboardSectionFooter>
                    </DashboardSection>
                  </DashboardBody>
                </DashboardContainer>
              }
              footer={
                <DashboardFooter
                  summary={
                    <span className="text-sm text-gray-500">Data last updated just now.</span>
                  }
                />
              }
            />
          </Dashboard>
        )}
      </div>
    </div>
  );
}
