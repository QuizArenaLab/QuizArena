"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { calculateQuestionHealth } from "@/lib/validations/question-engine";
import { checkDuplicateLive } from "@/features/admin/services/question-bank";
import { SimilarQuestionsPanel } from "./SimilarQuestionsPanel";
import type { DuplicateCheckResult } from "@/features/admin/services/question-bank/duplicate-detection";

export function LiveValidationSidebar() {
  const { control } = useFormContext();
  const formData = useWatch({ control });

  const [duplicateResult, setDuplicateResult] = useState<DuplicateCheckResult | undefined>();
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (formData.question && formData.question.trim().length >= 10) {
        setIsCheckingDuplicates(true);
        const result = await checkDuplicateLive({
          question: formData.question,
          category: formData.category,
          subject: formData.subject,
          explanation: formData.explanation,
          options: formData.options,
        } as any);
        setDuplicateResult(result as any);
        setIsCheckingDuplicates(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(handler);
  }, [
    formData.question,
    formData.category,
    formData.subject,
    formData.explanation,
    formData.options,
  ]);

  const { score, grade, status, blockingErrors, improvementSuggestions, breakdown } = useMemo(
    () => calculateQuestionHealth(formData as any, duplicateResult),
    [formData, duplicateResult]
  );

  const getHealthColor = () => {
    if (status === "EXCELLENT") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (status === "GOOD") return "text-blue-600 bg-blue-50 border-blue-200";
    if (status === "NEEDS_IMPROVEMENT") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getHealthLabel = () => {
    if (status === "EXCELLENT") return "Excellent";
    if (status === "GOOD") return "Good";
    if (status === "NEEDS_IMPROVEMENT") return "Needs Improvement";
    return "Poor";
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden sticky top-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Question Health</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {/* Overall Score */}
          <div
            className={`p-4 rounded-xl border mb-6 flex flex-col items-center justify-center text-center transition-colors ${getHealthColor()}`}
          >
            <span className="text-3xl font-black mb-1">
              {score} <span className="text-lg text-current/60 font-medium">/ 100</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              {grade} &bull; {getHealthLabel()}
            </span>
            {score >= 75 && blockingErrors.length === 0 ? (
              <span className="text-xs mt-2 font-semibold bg-white/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready For Publish
              </span>
            ) : (
              <span className="text-xs mt-2 font-semibold bg-white/50 px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80">
                Cannot Publish
              </span>
            )}
          </div>

          {/* Breakdown Checklist */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${breakdown.structure === 25 ? "text-emerald-500" : "text-gray-300"}`}
                />
                <span
                  className={
                    breakdown.structure === 25 ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  Structure Quality
                </span>
              </div>
              <span className="font-semibold text-gray-400">{breakdown.structure}/25</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${breakdown.metadata === 20 ? "text-emerald-500" : "text-gray-300"}`}
                />
                <span
                  className={
                    breakdown.metadata === 20 ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  Metadata Quality
                </span>
              </div>
              <span className="font-semibold text-gray-400">{breakdown.metadata}/20</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${breakdown.explanation === 20 ? "text-emerald-500" : "text-gray-300"}`}
                />
                <span
                  className={
                    breakdown.explanation === 20 ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  Explanation Quality
                </span>
              </div>
              <span className="font-semibold text-gray-400">{breakdown.explanation}/20</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${breakdown.answerIntegrity === 15 ? "text-emerald-500" : "text-gray-300"}`}
                />
                <span
                  className={
                    breakdown.answerIntegrity === 15 ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  Answer Integrity
                </span>
              </div>
              <span className="font-semibold text-gray-400">{breakdown.answerIntegrity}/15</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${breakdown.duplicates === 10 ? "text-emerald-500" : "text-gray-300"}`}
                />
                <span
                  className={
                    breakdown.duplicates === 10 ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  {isCheckingDuplicates ? "Checking Duplicates..." : "Duplicate Check"}
                </span>
              </div>
              <span className="font-semibold text-gray-400">
                {isCheckingDuplicates ? "-" : `${breakdown.duplicates || 0}/10`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${breakdown.completeness === 10 ? "text-emerald-500" : "text-gray-300"}`}
                />
                <span
                  className={
                    breakdown.completeness === 10 ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  Content Completeness
                </span>
              </div>
              <span className="font-semibold text-gray-400">{breakdown.completeness}/10</span>
            </div>
          </div>

          {/* Errors & Suggestions */}
          {(blockingErrors.length > 0 || improvementSuggestions.length > 0) && (
            <div className="border-t border-gray-100 pt-4 space-y-4">
              {blockingErrors.length > 0 && (
                <div>
                  <div className="flex items-start gap-1.5 text-red-600 mb-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Blocking Errors
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {blockingErrors.map((err, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-red-700 bg-red-50/50 px-2.5 py-1.5 rounded border border-red-100 flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {improvementSuggestions.length > 0 && (
                <div>
                  <div className="flex items-start gap-1.5 text-amber-600 mb-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Improvement Suggestions
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {improvementSuggestions.map((err, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-amber-700 bg-amber-50/50 px-2.5 py-1.5 rounded border border-amber-100 flex items-start gap-2"
                      >
                        <span className="text-amber-400 mt-0.5">•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {duplicateResult && duplicateResult.candidates.length > 0 && (
        <SimilarQuestionsPanel duplicateResult={duplicateResult} />
      )}
    </>
  );
}
