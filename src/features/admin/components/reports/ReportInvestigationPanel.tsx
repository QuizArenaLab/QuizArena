"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Trophy,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Ban,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ReportData } from "@/types/reports";
import { REPORT_TYPE_LABELS, REPORT_PRIORITY_LABELS, REPORT_STATUS_LABELS } from "@/types/reports";

interface ReportInvestigationPanelProps {
  report: ReportData;
  onClose: () => void;
  onActionComplete: () => void;
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    case "HIGH":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
    case "MEDIUM":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "OPEN":
      return { bg: "bg-amber-50", text: "text-amber-700" };
    case "UNDER_REVIEW":
      return { bg: "bg-blue-50", text: "text-blue-700" };
    case "RESOLVED":
      return { bg: "bg-emerald-50", text: "text-emerald-700" };
    case "DISMISSED":
      return { bg: "bg-gray-50", text: "text-gray-500" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-500" };
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportInvestigationPanel({
  report,
  onClose,
  onActionComplete,
}: ReportInvestigationPanelProps) {
  const [isActioning, setIsActioning] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showNotes, setShowNotes] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState(report.priority);
  const [showActions, setShowActions] = useState(false);

  const priorityClasses = getPriorityClasses(report.priority);
  const statusClasses = getStatusClasses(report.status);
  const isResolvable = report.status === "OPEN" || report.status === "UNDER_REVIEW";

  async function performAction(actionFn: () => Promise<{ success: boolean; message: string }>) {
    setIsActioning(true);
    setActionMessage("");
    try {
      const result = await actionFn();
      setActionMessage(result.message);
      if (result.success) {
        setTimeout(() => onActionComplete(), 1200);
      }
    } catch {
      setActionMessage("Action failed. Please try again.");
    } finally {
      setIsActioning(false);
    }
  }

  async function handleMarkUnderReview() {
    const { markReportUnderReview } = await import("@/features/admin/services/reports");
    await performAction(() => markReportUnderReview(report.id));
  }

  async function handleResolve() {
    if (!resolutionNotes.trim()) {
      setActionMessage("Resolution notes are required.");
      return;
    }
    const { resolveReport } = await import("@/features/admin/services/reports");
    await performAction(() => resolveReport(report.id, resolutionNotes));
  }

  async function handleDismiss() {
    const { dismissReport } = await import("@/features/admin/services/reports");
    await performAction(() =>
      dismissReport(report.id, resolutionNotes || "Dismissed after investigation")
    );
  }

  async function handleSuspendUser() {
    if (!report.targetUser) return;
    const { suspendReportedUser } = await import("@/features/admin/services/reports");
    await performAction(() => suspendReportedUser(report.id, report.targetUser!.id));
  }

  async function handleFlagUser() {
    if (!report.targetUser) return;
    const { flagReportedUser } = await import("@/features/admin/services/reports");
    await performAction(() => flagReportedUser(report.id, report.targetUser!.id));
  }

  async function handleAddNote() {
    if (!noteContent.trim()) return;
    const { addReportNote } = await import("@/features/admin/services/reports");
    const result = await addReportNote(report.id, noteContent);
    if (result.success) {
      setNoteContent("");
      onActionComplete();
    }
  }

  async function handlePriorityChange(newPriority: string) {
    setSelectedPriority(newPriority as typeof selectedPriority);
    const { updateReportPriority } = await import("@/features/admin/services/reports");
    await updateReportPriority(report.id, newPriority);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#0A1C40] hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Reports
        </button>
        <div className="flex-1" />
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${priorityClasses.bg} ${priorityClasses.text} ${priorityClasses.border} border`}
        >
          {REPORT_PRIORITY_LABELS[report.priority]}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusClasses.bg} ${statusClasses.text}`}
        >
          {REPORT_STATUS_LABELS[report.status]}
        </span>
      </div>

      {/* Investigation Title */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-linear-to-br from-[#0A1C40] to-secondary rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#0A1C40]">
              {REPORT_TYPE_LABELS[report.type]} Investigation
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{report.reason}</p>
            {report.description && (
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {report.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Reported: {formatDate(report.createdAt)}
              </span>
              <span>ID: {report.id.slice(0, 8)}…</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column — Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Reporter Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Reporter Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {report.reportedBy.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A1C40]">
                  {report.reportedBy.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-400">{report.reportedBy.email || "—"}</p>
              </div>
            </div>
          </div>

          {/* Target Entity */}
          {report.targetUser && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Reported User
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm">
                    {report.targetUser.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1C40]">
                      {report.targetUser.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">{report.targetUser.email || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.targetUser.flagged && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Flag className="w-2.5 h-2.5" />
                      Flagged
                    </span>
                  )}
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      report.targetUser.accountState === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : report.targetUser.accountState === "SUSPENDED"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {report.targetUser.accountState}
                  </span>
                </div>
              </div>
            </div>
          )}

          {report.targetChallenge && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5" />
                Reported Challenge
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1C40]">
                    {report.targetChallenge.title}
                  </p>
                  <p className="text-xs text-gray-400">Status: {report.targetChallenge.status}</p>
                </div>
              </div>
            </div>
          )}

          {report.targetQuestion && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Reported Question
              </h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {report.targetQuestion.question}
              </p>
              <p className="text-xs text-gray-400 mt-2">Status: {report.targetQuestion.status}</p>
            </div>
          )}

          {/* Resolution Details (if resolved) */}
          {report.resolutionNotes && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Resolution
              </h3>
              <p className="text-sm text-emerald-800">{report.resolutionNotes}</p>
              {report.reviewedBy && (
                <p className="text-xs text-emerald-600 mt-2">
                  Reviewed by: {report.reviewedBy.name} •{" "}
                  {report.updatedAt && formatDate(report.updatedAt)}
                </p>
              )}
            </div>
          )}

          {/* Internal Notes */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Investigation Notes ({report.notes.length})
              </h3>
              {showNotes ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showNotes && (
              <div className="mt-3 space-y-3">
                {report.notes.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No investigation notes yet.</p>
                )}
                {report.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="font-medium">{note.author.name || "Admin"}</span>
                      <span>•</span>
                      <span>{formatDate(note.createdAt)}</span>
                      {note.isInternal && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-semibold">Internal</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Note */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add investigation note…"
                    className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNote();
                    }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteContent.trim()}
                    className="px-3 py-2 bg-[#0A1C40] text-white rounded-lg text-xs font-semibold hover:bg-[#0A1C40]/80 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Actions */}
        <div className="space-y-5">
          {/* Priority Control */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Priority Classification
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((p) => {
                const isSelected = selectedPriority === p;
                const cls = getPriorityClasses(p);
                return (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      isSelected
                        ? `${cls.bg} ${cls.text} ${cls.border} border-2 shadow-sm`
                        : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    {REPORT_PRIORITY_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Moderation Actions */}
          {isResolvable && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Moderation Actions
              </h3>

              <div className="space-y-2.5">
                {report.status === "OPEN" && (
                  <button
                    onClick={handleMarkUnderReview}
                    disabled={isActioning}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Mark Under Review
                  </button>
                )}

                {/* Resolution */}
                <div className="space-y-2">
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Resolution notes (required to resolve)…"
                    rows={3}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleResolve}
                    disabled={isActioning || !resolutionNotes.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolve Report
                  </button>
                  <button
                    onClick={handleDismiss}
                    disabled={isActioning}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Dismiss Report
                  </button>
                </div>

                {/* User-specific actions */}
                {report.targetUser && (
                  <>
                    <div className="border-t border-gray-100 pt-2.5 mt-2.5">
                      <button
                        onClick={() => setShowActions(!showActions)}
                        className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2"
                      >
                        User Actions
                        {showActions ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      {showActions && (
                        <div className="space-y-2">
                          <button
                            onClick={handleFlagUser}
                            disabled={isActioning || report.targetUser.flagged}
                            className="w-full flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors disabled:opacity-50"
                          >
                            <Flag className="w-3.5 h-3.5" />
                            {report.targetUser.flagged
                              ? "User Already Flagged"
                              : "Flag User for Monitoring"}
                          </button>
                          <button
                            onClick={handleSuspendUser}
                            disabled={isActioning || report.targetUser.accountState === "SUSPENDED"}
                            className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {report.targetUser.accountState === "SUSPENDED"
                              ? "User Already Suspended"
                              : "Suspend User Account"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Feedback */}
          {actionMessage && (
            <div
              className={`rounded-lg p-3 text-sm font-medium ${
                actionMessage.includes("success") ||
                actionMessage.includes("resolved") ||
                actionMessage.includes("flagged") ||
                actionMessage.includes("suspended")
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {actionMessage}
            </div>
          )}

          {/* Audit Trail */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Audit Trail
            </h3>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span>Created: {formatDate(report.createdAt)}</span>
              </div>
              {report.reviewedBy && (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>
                    Reviewed by {report.reviewedBy.name}
                    {report.updatedAt && `: ${formatDate(report.updatedAt)}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>
                  Last updated: {report.updatedAt ? formatDate(report.updatedAt as any) : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
