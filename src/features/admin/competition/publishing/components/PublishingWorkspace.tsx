"use client";

import { useState } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { PublishWorkspaceData } from "../publishing/types/publishing.types";
import { usePublishingStore } from "../hooks/usePublishingStore";
import { useValidation } from "../hooks/useValidation";
import { usePublishingLock } from "../hooks/usePublishingLock";
import { CompetitionSummaryPanel } from "./CompetitionSummaryPanel";
import { ValidationReportPanel } from "./ValidationReportPanel";
import { PublishingConfigPanel } from "./PublishingConfigPanel";
import { PublishChecklist } from "./PublishChecklist";
import { PublishingTimeline } from "./PublishingTimeline";
import { VersionHistoryDrawer } from "./VersionHistoryDrawer";
import { PublishConfirmDialog } from "./PublishConfirmDialog";
import { PublishingLockBanner } from "./PublishingLockBanner";
import { CompetitionPreviewShell } from "../preview/components/CompetitionPreviewShell";
import {
  markCompetitionReady,
  publishCompetition,
  saveDraft,
} from "../publishing/actions/publishing.actions";
import { scheduleCompetition } from "../scheduling/actions/scheduling.actions";
import { rollbackCompetitionVersion } from "../versioning/actions/versioning.actions";
import { toast } from "react-hot-toast";

interface PublishingWorkspaceProps {
  initialData: PublishWorkspaceData;
  currentUserId: string;
}

export function PublishingWorkspace({ initialData, currentUserId }: PublishingWorkspaceProps) {
  // Client state stores
  const activeTab = usePublishingStore((s) => s.activeTab);
  const setActiveTab = usePublishingStore((s) => s.setActiveTab);
  const config = usePublishingStore((s) => s.config);
  const setSubmitting = usePublishingStore((s) => s.setSubmitting);

  // Hooks
  const { report, score, isValidating, runValidation } = useValidation(
    initialData.competition.id,
    initialData.validationReport,
    initialData.readinessScore
  );

  const { isLockedByOther } = usePublishingLock(initialData.publishingLock, currentUserId);

  // Local UI state
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Handlers
  const handleSaveDraft = async () => {
    setSubmitting(true);
    try {
      await saveDraft(initialData.competition.id);
      toast.success("Saved as draft");
    } catch (e: any) {
      toast.error(e.message || "Failed to save draft");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkReady = async () => {
    setSubmitting(true);
    try {
      await markCompetitionReady(initialData.competition.id);
      toast.success("Competition marked as ready");
      window.location.reload(); // Hard refresh to get fresh data for now
    } catch (e: any) {
      toast.error(e.message || "Failed to mark ready");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishRequest = () => {
    setShowConfirm(true);
  };

  const handleConfirmPublish = async () => {
    setSubmitting(true);
    try {
      if (config.mode === "IMMEDIATE") {
        await publishCompetition(initialData.competition.id, {
          mode: "IMMEDIATE",
          changelog: config.changelog,
          timezone: config.timezone,
        });
        toast.success("Competition published successfully!");
      } else {
        if (!config.scheduledDate) throw new Error("Scheduled date required");
        await scheduleCompetition(initialData.competition.id, {
          publishAt: new Date(config.scheduledDate),
          timezone: config.timezone,
        });
        toast.success("Competition scheduled successfully!");
      }
      setShowConfirm(false);
      window.location.reload();
    } catch (e: any) {
      toast.error(e.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRollback = async (versionNumber: number) => {
    if (
      !confirm(
        `Are you sure you want to rollback to v${versionNumber}? This will create a new version.`
      )
    )
      return;

    setSubmitting(true);
    try {
      await rollbackCompetitionVersion(initialData.competition.id, versionNumber);
      toast.success(`Rolled back to v${versionNumber}`);
      window.location.reload();
    } catch (e: any) {
      toast.error(e.message || "Rollback failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <PublishingLockBanner currentUserId={currentUserId} />

      {/* Top Navbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-black text-navy text-xl">Publishing Studio</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "overview" ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "preview" ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Preview
            </button>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm font-medium text-gray-600 hover:text-navy px-3 py-1.5 rounded hover:bg-gray-100"
          >
            Version History
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {activeTab === "preview" ? (
          <div className="h-full relative overflow-hidden">
            <CompetitionPreviewShell competition={initialData.competition} />
          </div>
        ) : (
          <>
            {/* @ts-expect-error - react-resizable-panels typings issue */}
            <PanelGroup direction="horizontal" className="flex-1">
              {/* Left Panel: Summary */}
              <Panel defaultSize={25} minSize={20} maxSize={35}>
                <CompetitionSummaryPanel
                  competition={initialData.competition}
                  readinessScore={score}
                />
              </Panel>

              <PanelResizeHandle className="w-1.5 bg-gray-200 hover:bg-primary/50 transition-colors cursor-col-resize" />

              {/* Center Panel: Report */}
              <Panel defaultSize={45} minSize={30}>
                <ValidationReportPanel
                  competition={initialData.competition}
                  report={report}
                  isValidating={isValidating}
                  onRevalidate={runValidation}
                />
              </Panel>

              <PanelResizeHandle className="w-1.5 bg-gray-200 hover:bg-primary/50 transition-colors cursor-col-resize" />

              {/* Right Panel: Actions */}
              <Panel defaultSize={30} minSize={25} maxSize={40} className="bg-slate-50/50">
                <div className="h-full overflow-y-auto p-6 flex flex-col gap-6">
                  <PublishingConfigPanel
                    competition={initialData.competition}
                    readinessScore={score}
                    onSaveDraft={handleSaveDraft}
                    onMarkReady={handleMarkReady}
                    onPublish={handlePublishRequest}
                  />
                  <PublishChecklist items={initialData.checklist} />
                </div>
              </Panel>
            </PanelGroup>
          </>
        )}
      </div>

      {/* Bottom Timeline */}
      <PublishingTimeline auditTrail={initialData.auditTrail} />

      {/* Overlays */}
      <VersionHistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        versions={initialData.versions}
        onRollback={handleRollback}
      />

      <PublishConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmPublish}
        checklist={initialData.checklist}
      />

      {/* Disable click block if locked by other */}
      {isLockedByOther && (
        <div className="absolute inset-0 z-40 bg-white/20 cursor-not-allowed"></div>
      )}
    </div>
  );
}
