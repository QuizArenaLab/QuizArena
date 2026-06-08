"use client";

import { AlertTriangle, Copy, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";
import type { DuplicateCheckResult } from "@/features/admin/services/question-bank/duplicate-detection";

interface Props {
  duplicateResult?: DuplicateCheckResult;
}

export function SimilarQuestionsPanel({ duplicateResult }: Props) {
  if (!duplicateResult || duplicateResult.candidates.length === 0) return null;

  return (
    <div className="bg-white border border-red-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden sticky top-6">
      <div className="p-4 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-red-900 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Similar Questions Found
        </h3>
        <span className="text-xs font-semibold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
          {duplicateResult.candidates.length} Match
          {duplicateResult.candidates.length > 1 ? "es" : ""}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {duplicateResult.status === "EXACT" && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs font-medium border border-red-200 flex gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-red-600" />
            <p>
              An exact duplicate was found. You cannot publish this question until it is
              significantly different.
            </p>
          </div>
        )}

        {duplicateResult.candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="border border-gray-200 rounded-lg p-3 hover:border-red-300 transition-colors bg-gray-50/50"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">
                {candidate.questionCode || "DRAFT"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${candidate.matchType === "EXACT" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
              >
                {candidate.matchType === "EXACT"
                  ? "100% Match"
                  : `${Math.round(candidate.similarity * 100)}% Similar`}
              </span>
            </div>

            <div className="text-xs text-gray-500 mb-3 space-y-1">
              {candidate.category && (
                <p>
                  <span className="font-semibold">Exam:</span> {candidate.category}
                </p>
              )}
              {candidate.subject && (
                <p>
                  <span className="font-semibold">Subject:</span> {candidate.subject}
                </p>
              )}
              <p>
                <span className="font-semibold">Status:</span> {candidate.status}
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(candidate.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Link
              href={`/dashboard/admin/question-bank/${candidate.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              <ExternalLink className="w-3 h-3" /> View Original
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
