import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Bookmark,
  Activity,
  FileQuestion,
  TrendingUp,
  History,
  CheckCircle2,
} from "lucide-react";
import { searchQuestions, getSavedFilters } from "@/features/admin/services/question-search";
import { QUESTION_CATEGORIES, COMMON_SUBJECTS } from "@/features/admin/services/question-bank/constants";
import { QUESTION_DIFFICULTIES, QUESTION_STATUSES } from "@/lib/validations/question";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Discovery",
  description: "Enterprise operational search and discovery infrastructure",
};

export const dynamic = "force-dynamic";

function DiscoveryFilters({
  currentFilters,
  savedFilters,
}: {
  currentFilters: any;
  savedFilters: any[];
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" /> Operational Discovery
        </h2>

        {savedFilters.length > 0 && (
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-gray-400" />
            <select
              className="text-xs border-none bg-transparent focus:ring-0 text-gray-600 font-medium cursor-pointer"
              onChange={(e) => {
                if (e.target.value) {
                  window.location.href = `/dashboard/admin/question-bank/discovery?${e.target.value}`;
                }
              }}
            >
              <option value="">Saved Presets...</option>
              {savedFilters.map((f) => {
                const params = new URLSearchParams();
                if (f.filters.category) params.set("category", f.filters.category);
                if (f.filters.difficulty) params.set("difficulty", f.filters.difficulty);
                if (f.filters.status) params.set("status", f.filters.status);
                return (
                  <option key={f.id} value={params.toString()}>
                    {f.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <div className="p-5">
        <form method="GET" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="query"
              defaultValue={currentFilters.query || ""}
              placeholder="Search by question text, code, category, or keywords..."
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />

            <select
              name="category"
              defaultValue={currentFilters.category || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Categories</option>
              {QUESTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              name="subject"
              defaultValue={currentFilters.subject || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Subjects</option>
              {COMMON_SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={currentFilters.status || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Statuses</option>
              {QUESTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              name="difficulty"
              defaultValue={currentFilters.difficulty || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Difficulties</option>
              {QUESTION_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Search
            </button>

            {Object.values(currentFilters).some(Boolean) && (
              <Link
                href="/dashboard/admin/question-bank/discovery"
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SearchResults({ questions, total }: { questions: any[]; total: number }) {
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No operational matches found</h3>
        <p className="text-sm text-gray-500">
          Try loosening your search criteria or changing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-500 flex justify-between items-center">
        <span>
          Showing {questions.length} of {total} results
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          Indexed Retrieval
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {q.questionCode || "UNKNOWN"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                  ${q.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : ""}
                  ${q.status === "REVIEW" ? "bg-amber-100 text-amber-700" : ""}
                  ${q.status === "DRAFT" ? "bg-gray-100 text-gray-600" : ""}
                  ${q.status === "REJECTED" ? "bg-rose-100 text-rose-700" : ""}
                  ${q.status === "ARCHIVED" ? "bg-violet-100 text-violet-700" : ""}
                `}
                >
                  {q.status}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                  {q.difficulty}
                </span>
              </div>

              <Link href={`/dashboard/admin/question-bank/${q.id}/edit`} className="block">
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {q.question}
                </h3>
              </Link>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FileQuestion className="w-3 h-3" /> {q.category || "Uncategorized"}
                </span>
                {q.subject && <span className="flex items-center gap-1">• {q.subject}</span>}
              </div>
            </div>

            {/* Operational Intelligence Sidebar */}
            <div className="md:w-48 shrink-0 flex flex-col justify-center gap-3 pl-4 md:border-l border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Accuracy
                </span>
                <span className="font-bold text-gray-900">
                  {q.analytics?.accuracyRate?.toFixed(1) || "0.0"}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <History className="w-4 h-4" /> Usage
                </span>
                <span className="font-bold text-gray-900">{q.analytics?.usageCount || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Attempts
                </span>
                <span className="font-bold text-gray-900">{q.analytics?.totalAttempts || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function DiscoveryContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const subject = typeof params.subject === "string" ? params.subject : undefined;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const currentFilters = { query, category, subject, difficulty, status };

  const [searchResult, savedFilters] = await Promise.all([
    searchQuestions({
      query,
      filters: { category, subject, difficulty, status },
      page,
      limit: 20,
    }),
    getSavedFilters(),
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
            <Search className="w-6 h-6 text-indigo-600" />
            Discovery & Search
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            High-speed operational retrieval for challenges and governance
          </p>
        </div>
      </div>

      <DiscoveryFilters currentFilters={currentFilters} savedFilters={savedFilters} />

      <SearchResults questions={searchResult.questions} total={searchResult.total} />

      {/* Pagination Controls */}
      {searchResult.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          {page > 1 && (
            <Link
              href={`?query=${query || ""}&category=${category || ""}&difficulty=${difficulty || ""}&status=${status || ""}&page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-500 px-4">
            Page {page} of {searchResult.totalPages}
          </span>
          {page < searchResult.totalPages && (
            <Link
              href={`?query=${query || ""}&category=${category || ""}&difficulty=${difficulty || ""}&status=${status || ""}&page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiscoveryPage({
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
            <p className="text-sm text-gray-500">Querying indexed storage…</p>
          </div>
        </div>
      }
    >
      <DiscoveryContent searchParams={searchParams} />
    </Suspense>
  );
}
