"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitForReview,
  approveQuestion,
  rejectQuestion,
  archiveQuestion,
  flagQuestion,
} from "@/features/admin/services/question-bank";
import { QuestionStatusBadge } from "./QuestionStatusBadge";
import { QuestionCodeBadge } from "./QuestionCodeBadge";
import { UsageIntelligencePanel } from "./UsageIntelligencePanel";
import type { QuestionIntelligence } from "@/features/admin/services/question-bank/usage-intelligence";
import { DIFFICULTY_CONFIG } from "@/features/admin/services/question-bank/constants";
import {
  getAvailableTransitions,
  getTransitionAction,
} from "@/features/admin/services/question-bank/governance";
import {
  CheckCircle2,
  User,
  Calendar,
  Hash,
  Tag,
  Globe,
  BookOpen,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface QuestionDetailData {
  id: string;
  questionCode: string | null;
  question: string;
  explanation: string | null;
  subject: string | null;
  category: string | null;
  topic: string | null;
  language: string;
  marks: number;
  negativeMarks: number;
  difficulty: string;
  status: string;
  tags: string[];
  version: number;
  usageCount: number;
  isActive: boolean;
  reviewNotes: string | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  createdBy: { id: string; name: string | null; email: string | null } | null;
  reviewedBy: { id: string; name: string | null; email: string | null } | null;
  approvedBy: { id: string; name: string | null; email: string | null } | null;
  _count: { challenges: number };
  options: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }>;
}

interface QuestionDetailViewProps {
  question: QuestionDetailData;
  userRole: string;
  intelligence?: QuestionIntelligence | null;
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function QuestionDetailView({ question, userRole, intelligence }: QuestionDetailViewProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const diffConfig = DIFFICULTY_CONFIG[question.difficulty as keyof typeof DIFFICULTY_CONFIG];

  const availableTransitions = getAvailableTransitions(question.status, userRole);

  const handleTransition = async (targetStatus: string) => {
    setError(null);
    setIsTransitioning(true);
    try {
      let result: { success: boolean; error?: string };

      switch (targetStatus) {
        case "REVIEW":
          result = await submitForReview(question.id);
          break;
        case "APPROVED":
          result = await approveQuestion(question.id, reason || undefined);
          break;
        case "REJECTED":
          result = await rejectQuestion(question.id, reason);
          break;
        case "ARCHIVED":
          result = await archiveQuestion(question.id);
          break;
        case "FLAGGED":
          result = await flagQuestion(question.id, reason);
          break;
        default:
          result = { success: false, error: "Unknown transition" };
      }

      if (result.success) {
        setShowReasonInput(null);
        setReason("");
        router.refresh();
      } else {
        setError(result.error || "Transition failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div className="space-y-2">
            <QuestionCodeBadge code={question.questionCode} />
            <div className="flex items-center gap-2 flex-wrap">
              <QuestionStatusBadge status={question.status} />
              {diffConfig && (
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: diffConfig.bgColor,
                    color: diffConfig.color,
                  }}
                >
                  {diffConfig.label}
                </span>
              )}
              <span className="text-xs font-mono text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                v{question.version}
              </span>
            </div>
          </div>

          {/* Governance Actions */}
          {availableTransitions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableTransitions.map((transition) => {
                const actionMeta = getTransitionAction(transition.from, transition.to);
                if (!actionMeta) return null;

                const needsReason = transition.requiresReason;

                if (needsReason && showReasonInput !== transition.to) {
                  return (
                    <button
                      key={transition.to}
                      onClick={() => setShowReasonInput(transition.to)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        actionMeta.variant === "approve"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : actionMeta.variant === "reject"
                            ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                            : actionMeta.variant === "warning"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {actionMeta.label}
                    </button>
                  );
                }

                if (!needsReason) {
                  return (
                    <button
                      key={transition.to}
                      onClick={() => handleTransition(transition.to)}
                      disabled={isTransitioning}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 ${
                        actionMeta.variant === "approve"
                          ? "bg-linear-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-sm"
                          : actionMeta.variant === "reject"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isTransitioning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {actionMeta.label}
                    </button>
                  );
                }

                return null;
              })}
            </div>
          )}
        </div>

        {/* Reason Input */}
        {showReasonInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason (required)…"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleTransition(showReasonInput)}
                disabled={isTransitioning || !reason.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isTransitioning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setShowReasonInput(null);
                  setReason("");
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Question Text */}
        <div className="mt-5 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">
            {question.question}
          </p>
        </div>

        {/* Review / Rejection Notes */}
        {question.rejectionReason && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
              Rejection Reason
            </p>
            <p className="text-sm text-red-700">{question.rejectionReason}</p>
          </div>
        )}
        {question.reviewNotes && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
              Review Notes
            </p>
            <p className="text-sm text-blue-700">{question.reviewNotes}</p>
          </div>
        )}
      </div>

      {/* Options Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Answer Options
        </h3>
        <div className="space-y-2.5">
          {question.options
            .sort((a, b) => a.order - b.order)
            .map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  opt.isCorrect ? "border-emerald-300 bg-emerald-50/50" : "border-gray-100 bg-white"
                }`}
              >
                <span className="text-xs font-bold text-gray-400 w-6">
                  {String.fromCharCode(65 + opt.order)}
                </span>
                <span className="flex-1 text-sm text-gray-800">{opt.optionText}</span>
                {opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </div>
            ))}
        </div>
      </div>

      {/* Explanation Card */}
      {question.explanation && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Explanation
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Usage Intelligence Panel */}
      {intelligence && (
        <UsageIntelligencePanel
          intelligence={intelligence}
          configuredDifficulty={question.difficulty}
        />
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Classification */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Classification
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{question.category || "—"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {question.subject || "—"} {question.topic ? `/ ${question.topic}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{question.language.toUpperCase()}</span>
            </div>
            {question.tags.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-600 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Governance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Governance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Created by{" "}
                <strong>
                  {question.createdBy?.name || question.createdBy?.email || "Unknown"}
                </strong>
              </span>
            </div>
            {question.reviewedBy && (
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Reviewed by{" "}
                  <strong>{question.reviewedBy.name || question.reviewedBy.email}</strong>
                </span>
              </div>
            )}
            {question.approvedBy && (
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600">
                  Approved by{" "}
                  <strong>{question.approvedBy.name || question.approvedBy.email}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Created {formatDate(question.createdAt)}
              </span>
            </div>
            <div className="text-xs text-gray-500 space-y-1 pt-1 border-t border-gray-100">
              <p>
                Usage: <strong>{question.usageCount}</strong> challenge
                {question.usageCount !== 1 ? "s" : ""}
              </p>
              <p>
                Active challenges: <strong>{question._count.challenges}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
