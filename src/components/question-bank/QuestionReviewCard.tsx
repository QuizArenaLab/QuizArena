"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveQuestion,
  rejectQuestion,
  flagQuestion,
  archiveQuestion,
} from "@/actions/question-bank";
import { QuestionStatusBadge } from "./QuestionStatusBadge";
import { QuestionCodeBadge } from "./QuestionCodeBadge";
import { QuestionModerationHistory } from "./QuestionModerationHistory";
import { DIFFICULTY_CONFIG } from "@/lib/question-bank/constants";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Flag,
  Archive,
  Info,
  GitCommit,
} from "lucide-react";

interface ReviewQuestion {
  id: string;
  questionCode: string | null;
  question: string;
  explanation: string | null;
  version: number;
  subject: string | null;
  category: string | null;
  difficulty: string;
  status: string;
  marks: number;
  createdBy: { id: string; name: string | null; email: string | null } | null;
  createdAt: Date;
  options: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }>;
}

interface QuestionReviewCardProps {
  question: ReviewQuestion;
}

const REJECTION_REASONS = [
  "Incorrect Answer",
  "Poor Question Clarity",
  "Duplicate Content",
  "Weak Explanation",
  "Difficulty Mismatch",
  "Invalid Formatting",
  "Other",
];

export function QuestionReviewCard({ question }: QuestionReviewCardProps) {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showFlagForm, setShowFlagForm] = useState(false);

  // Form states
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [customRejectionReason, setCustomRejectionReason] = useState("");
  const [flagReason, setFlagReason] = useState("");

  const diffConfig = DIFFICULTY_CONFIG[question.difficulty as keyof typeof DIFFICULTY_CONFIG];

  const handleAction = async (
    actionFn: () => Promise<{ success: boolean; error?: string }>,
    validationFn?: () => string | null
  ) => {
    if (validationFn) {
      const err = validationFn();
      if (err) {
        setError(err);
        return;
      }
    }

    setError(null);
    setIsProcessing(true);
    try {
      const result = await actionFn();
      if (result.success) {
        setShowRejectForm(false);
        setShowFlagForm(false);
        router.refresh();
      } else {
        setError(result.error || "Action failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = () =>
    handleAction(() => approveQuestion(question.id, reviewNotes || undefined));

  const handleReject = () =>
    handleAction(
      () => {
        const finalReason = rejectionReason === "Other" ? customRejectionReason : rejectionReason;
        return rejectQuestion(question.id, finalReason);
      },
      () => {
        if (!rejectionReason) return "Please select a rejection reason";
        if (rejectionReason === "Other" && !customRejectionReason.trim())
          return "Please provide a custom reason";
        return null;
      }
    );

  const handleFlag = () =>
    handleAction(
      () => flagQuestion(question.id, flagReason),
      () => (!flagReason.trim() ? "Flag reason is required" : null)
    );

  const handleArchive = () => handleAction(() => archiveQuestion(question.id));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <QuestionCodeBadge code={question.questionCode} />
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
              <GitCommit className="w-3 h-3" /> v{question.version}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <QuestionStatusBadge status={question.status} />
            {diffConfig && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block"
                style={{
                  backgroundColor: diffConfig.bgColor,
                  color: diffConfig.color,
                }}
              >
                {diffConfig.label}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm font-medium text-gray-900 leading-relaxed">{question.question}</p>

        {question.explanation && (
          <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50 flex gap-2 items-start">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900/80 leading-relaxed">
              <span className="font-semibold block mb-1">Explanation:</span>
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-500">
          <span>{question.category || question.subject}</span>
          <span className="hidden sm:inline">•</span>
          <span>
            {question.marks} mark{question.marks > 1 ? "s" : ""}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>By {question.createdBy?.name || question.createdBy?.email || "Unknown"}</span>
        </div>
      </div>

      {/* Options */}
      <div className="px-5 py-4 bg-gray-50/50">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
          Options
        </p>
        <div className="space-y-2">
          {question.options
            .sort((a, b) => a.order - b.order)
            .map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                  opt.isCorrect
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                    : "bg-white border border-gray-100 text-gray-700"
                }`}
              >
                <span className="text-xs font-bold text-gray-400 w-5">
                  {String.fromCharCode(65 + opt.order)}
                </span>
                {opt.optionText}
                {opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                )}
              </div>
            ))}
        </div>

        {/* Moderation History Component */}
        <QuestionModerationHistory questionId={question.id} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-3 bg-red-50 border-t border-red-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Actions Section */}
      <div className="p-5 border-t border-gray-100 space-y-3 bg-white">
        {/* -- STATUS: REVIEW -- */}
        {question.status === "REVIEW" && !showRejectForm && (
          <div className="space-y-3">
            <input
              type="text"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Review notes (optional)…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Approve
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        )}

        {/* -- STATUS: REVIEW (Reject Form Open) -- */}
        {question.status === "REVIEW" && showRejectForm && (
          <div className="space-y-3 bg-red-50/30 p-3 rounded-lg border border-red-100">
            <div className="text-sm font-medium text-red-800 mb-1">Reject Question</div>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Select a reason...</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {rejectionReason === "Other" && (
              <textarea
                value={customRejectionReason}
                onChange={(e) => setCustomRejectionReason(e.target.value)}
                placeholder="Please specify custom reason..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              />
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Rejection
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                disabled={isProcessing}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* -- FLAG FORM (Can be opened from multiple statuses) -- */}
        {showFlagForm && (
          <div className="space-y-3 bg-orange-50/50 p-3 rounded-lg border border-orange-200">
            <div className="text-sm font-medium text-orange-800 mb-1">
              Flag Question for Concern
            </div>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Why is this question being flagged? (e.g. Inaccurate content, user reports...)"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleFlag}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Flag
              </button>
              <button
                onClick={() => setShowFlagForm(false)}
                disabled={isProcessing}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* -- OTHER STATUSES (APPROVED, REJECTED, FLAGGED, ARCHIVED) -- */}
        {question.status !== "REVIEW" && !showFlagForm && (
          <div className="flex gap-2">
            {(question.status === "APPROVED" ||
              question.status === "REJECTED" ||
              question.status === "ARCHIVED") && (
              <button
                onClick={() => setShowFlagForm(true)}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                <Flag className="w-4 h-4" /> Flag
              </button>
            )}

            {(question.status === "APPROVED" || question.status === "FLAGGED") && (
              <button
                onClick={handleArchive}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ml-auto"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
                Archive
              </button>
            )}

            {/* Displaying that no actions available if applicable */}
            {question.status === "DRAFT" && (
              <span className="text-sm text-gray-500 italic">
                Drafts cannot be moderated directly.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
