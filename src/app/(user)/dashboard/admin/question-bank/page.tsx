import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  getQuestions,
  getQuestionBankStats,
  getDraftQuestions,
} from "@/features/admin/services/question-bank";
import { QuestionBankStatsCards } from "@/features/admin/components/question-bank/QuestionBankStats";
import { QuestionTable } from "@/features/admin/components/question-bank/QuestionTable";
import { QuestionFilters } from "@/features/admin/components/question-bank/QuestionFilters";
import { Plus, Eye, Edit3, Clock, Search } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Bank",
  description: "Enterprise question bank governance dashboard",
};

async function QuestionBankContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const subject = typeof params.subject === "string" ? params.subject : undefined;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const [stats, questionsResult, drafts] = await Promise.all([
    getQuestionBankStats(),
    getQuestions({
      search,
      category,
      subject,
      difficulty,
      status,
      page,
      limit: 20,
    }),
    getDraftQuestions(),
  ]);

  const currentFilters = { search, category, subject, difficulty, status };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Question Bank</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enterprise assessment governance infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/question-bank/discovery"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Search className="w-4 h-4" />
            Discovery
          </Link>
          <Link
            href={ROUTES.ADMIN.QUESTION_BANK_INTELLIGENCE}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <Clock className="w-4 h-4" /> {/* Or Brain if we add it, reusing Clock for now */}
            Intelligence
          </Link>
          <Link
            href="/dashboard/admin/question-bank/analytics"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href={ROUTES.ADMIN.QUESTION_BANK_REVIEW}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Review Queue
            {stats.review > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-violet-600 text-white rounded-full min-w-[18px] text-center">
                {stats.review}
              </span>
            )}
          </Link>
          <Link
            href={ROUTES.ADMIN.QUESTION_BANK_CREATE}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Question
          </Link>
        </div>
      </div>

      {/* Stats */}
      <QuestionBankStatsCards stats={stats} />

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-hidden">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> My Recent Drafts & Rejected
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <Link
                key={draft.id}
                href={`/dashboard/admin/question-bank/${draft.id}/edit`}
                className="group block p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      draft.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {draft.status}
                  </span>
                  <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                  {draft.questionCode || "Draft Question"}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {draft.question || "No content yet..."}
                </p>
                <div className="mt-3 text-[10px] text-gray-400 font-medium">
                  Last updated {draft.updatedAt.toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <QuestionFilters currentFilters={currentFilters} />
        <QuestionTable
          questions={questionsResult.questions}
          total={questionsResult.total}
          page={questionsResult.page}
          totalPages={questionsResult.totalPages}
          currentFilters={currentFilters}
        />
      </div>
    </div>
  );
}

export default function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading Question Bank…</p>
          </div>
        </div>
      }
    >
      <QuestionBankContent searchParams={searchParams} />
    </Suspense>
  );
}
