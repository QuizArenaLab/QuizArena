// @ts-nocheck
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Activity,
  Target,
  BarChart3,
  Repeat,
} from "lucide-react";
import {
  getCategoryPerformance,
  detectWeakQuestions,
  getDifficultyInsights,
  getQuestionUsageAnalytics,
} from "@/features/analytics/services/question-analytics";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Analytics",
  description: "Question performance and quality intelligence",
};

async function AnalyticsContent() {
  const [categoryStats, weakQuestions, difficultyMismatches, overusedQuestions] = await Promise.all(
    [
      getCategoryPerformance(),
      detectWeakQuestions(),
      getDifficultyInsights(),
      getQuestionUsageAnalytics(),
    ]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard/admin/question-bank"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Question Bank
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            Quality Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Operational assessment insights and question performance metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categoryStats.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No category data available
                </div>
              ) : (
                categoryStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{stat.category}</span>
                        <span className="text-sm font-bold text-gray-900">
                          {stat.averageAccuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${Math.min(stat.averageAccuracy, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-xs text-gray-500">{stat.totalAttempts} attempts</div>
                      <div className="text-xs text-gray-400">{stat.questionCount} questions</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Weak Questions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Weak Questions (Low/High Accuracy)
            </h2>
          </div>
          <div className="p-0">
            {weakQuestions.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">
                No weak questions detected
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {weakQuestions.map((wq) => (
                  <li
                    key={wq.id}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/dashboard/admin/question-bank/${wq.questionId}/edit`}
                          className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                          {wq.question.questionCode || "Unknown Code"}
                        </Link>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {wq.question.difficulty}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{wq.totalAttempts} total attempts</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${wq.accuracyRate < 20 ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {wq.accuracyRate.toFixed(1)}%
                      </div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Accuracy</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Difficulty Mismatches */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Difficulty Mismatches</h2>
          </div>
          <div className="p-0">
            {difficultyMismatches.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">No mismatches detected</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {difficultyMismatches.map((mismatch) => (
                  <li
                    key={mismatch.id}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/dashboard/admin/question-bank/${mismatch.questionId}/edit`}
                          className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                          {mismatch.question.questionCode || "Unknown Code"}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">
                        Assigned:{" "}
                        <span className="font-semibold text-gray-700">
                          {mismatch.question.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">
                        {mismatch.accuracyRate.toFixed(1)}%
                      </div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">
                        Actual Acc.
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Overused Questions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <Repeat className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Overused Questions</h2>
          </div>
          <div className="p-0">
            {overusedQuestions.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">No overused questions</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {overusedQuestions.map((oq) => (
                  <li
                    key={oq.id}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/dashboard/admin/question-bank/${oq.questionId}/edit`}
                          className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                          {oq.question.questionCode || "Unknown Code"}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">
                        {oq.question.category || "Uncategorized"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-violet-600">{oq.usageCount}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Uses</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading Quality Intelligence…</p>
          </div>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
