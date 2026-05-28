import Link from "next/link";
import { QuestionStatusBadge } from "./QuestionStatusBadge";
import { QuestionCodeBadge } from "./QuestionCodeBadge";
import { DIFFICULTY_CONFIG } from "@/lib/question-bank/constants";
import { ROUTES } from "@/lib/routes";
import type { QuestionBankItem } from "@/actions/question-bank";

interface QuestionTableProps {
  questions: QuestionBankItem[];
  total: number;
  page: number;
  totalPages: number;
  currentFilters: Record<string, string | undefined>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "…";
}

function buildPageUrl(page: number, filters: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  Object.entries(filters).forEach(([key, value]) => {
    if (value && key !== "page") params.set(key, value);
  });
  return `?${params.toString()}`;
}

export function QuestionTable({
  questions,
  total,
  page,
  totalPages,
  currentFilters,
}: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {Object.values(currentFilters).some(Boolean)
            ? "Try adjusting your filters to find questions"
            : "Create your first question to get started"}
        </p>
        <Link
          href={ROUTES.ADMIN.QUESTION_BANK_CREATE}
          className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm"
        >
          Create Question
        </Link>
      </div>
    );
  }

  const limit = 20;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Code
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Question
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Category
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Status
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Difficulty
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Version
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Created
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => {
              const diffConfig = DIFFICULTY_CONFIG[q.difficulty as keyof typeof DIFFICULTY_CONFIG];

              return (
                <tr key={q.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <QuestionCodeBadge code={q.questionCode} compact />
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="font-medium text-gray-900 text-sm leading-snug">
                      {truncate(q.question, 70)}
                    </p>
                    {q.subject && <p className="text-[11px] text-gray-400 mt-0.5">{q.subject}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{q.category || "—"}</td>
                  <td className="px-4 py-3.5">
                    <QuestionStatusBadge status={q.status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5">
                    {diffConfig ? (
                      <span className="text-xs font-semibold" style={{ color: diffConfig.color }}>
                        {diffConfig.label}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">{q.difficulty}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-gray-500">v{q.version}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{formatDate(q.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={ROUTES.ADMIN.QUESTION_BANK_DETAIL(q.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {questions.map((q) => {
          const diffConfig = DIFFICULTY_CONFIG[q.difficulty as keyof typeof DIFFICULTY_CONFIG];

          return (
            <Link
              key={q.id}
              href={ROUTES.ADMIN.QUESTION_BANK_DETAIL(q.id)}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <QuestionCodeBadge code={q.questionCode} compact />
                <QuestionStatusBadge status={q.status} size="sm" />
              </div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{q.question}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <span>{q.category || q.subject || "—"}</span>
                {diffConfig && (
                  <span style={{ color: diffConfig.color }} className="font-semibold">
                    {diffConfig.label}
                  </span>
                )}
                <span>v{q.version}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} questions
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1, currentFilters)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-gray-600 font-medium">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1, currentFilters)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
