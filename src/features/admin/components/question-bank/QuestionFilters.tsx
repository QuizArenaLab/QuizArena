import {
  QUESTION_CATEGORIES,
  COMMON_SUBJECTS,
} from "@/features/admin/services/question-bank/constants";
import { QUESTION_DIFFICULTIES, QUESTION_STATUSES } from "@/lib/validations/question";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface QuestionFiltersProps {
  currentFilters: {
    search?: string;
    category?: string;
    subject?: string;
    difficulty?: string;
    status?: string;
  };
}

export function QuestionFilters({ currentFilters }: QuestionFiltersProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50/50">
      <form method="GET" className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={currentFilters.search || ""}
            placeholder="Search by question text, code, subject, or category…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />

          <select
            name="category"
            defaultValue={currentFilters.category || ""}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[140px]"
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
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[140px]"
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
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[120px]"
          >
            <option value="">All Status</option>
            {QUESTION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <select
            name="difficulty"
            defaultValue={currentFilters.difficulty || ""}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[120px]"
          >
            <option value="">All Difficulty</option>
            {QUESTION_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <select
            name="intelligence"
            defaultValue={(currentFilters as any).intelligence || ""}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[150px]"
          >
            <option value="">Intelligence Flags</option>
            <option value="HEALTHY">Healthy</option>
            <option value="LOW_CONFIDENCE">Low Confidence</option>
            <option value="DIFFICULTY_DRIFT">Difficulty Drift</option>
            <option value="HIGH_REPORTS">High Reports</option>
            <option value="DECLINING">Declining Performance</option>
            <option value="OVERUSED">Overused</option>
            <option value="UNUSED">Unused</option>
            <option value="TOO_EASY">Too Easy</option>
            <option value="TOO_HARD">Too Hard</option>
            <option value="INSUFFICIENT_DATA">Insufficient Data</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm"
          >
            <Search className="w-4 h-4" />{" "}
          </button>

          {Object.values(currentFilters).some(Boolean) && (
            <Link
              href="/dashboard/admin/question-bank"
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
