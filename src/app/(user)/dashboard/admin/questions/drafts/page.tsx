import { Suspense } from "react";
import Link from "next/link";
import { getQuestions } from "@/features/admin/services/question-bank";
import { QuestionFilters } from "@/features/admin/components/question-bank/QuestionFilters";
import { ChevronLeft, ChevronRight, Edit3, FileEdit } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draft Questions | Question Bank",
  description: "View and manage draft questions",
};

async function DraftsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const subject = typeof params.subject === "string" ? params.subject : undefined;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const result = await getQuestions({
    status: "DRAFT",
    search,
    category,
    subject,
    difficulty,
    page,
    limit: 20,
  });

  const currentFilters = { search, category, subject, difficulty, status: "DRAFT" };
  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HARDCORE: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Draft Questions</h1>
        <p className="text-sm text-gray-500 mt-1">
          {result.total} draft question{result.total !== 1 ? "s" : ""} awaiting completion or submission
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <QuestionFilters currentFilters={currentFilters} />

        {result.questions.length === 0 ? (
          <div className="p-12 text-center">
            <FileEdit className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No draft questions found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Difficulty</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created By</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-bold text-gray-400 block mb-0.5">
                        {q.questionCode || q.id.slice(0, 8)}
                      </span>
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-md">{q.question}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-600">{q.category || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-600">{q.subject || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${difficultyColors[q.difficulty] || "bg-gray-100 text-gray-800"}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{q.createdBy?.name || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/dashboard/admin/question-bank/${q.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {result.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Page {result.page} of {result.totalPages} · {result.total} total</span>
                <div className="flex gap-2">
                  {result.page > 1 && (
                    <Link href={`/dashboard/admin/questions/drafts?page=${result.page - 1}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <ChevronLeft className="w-3 h-3" /> Prev
                    </Link>
                  )}
                  {result.page < result.totalPages && (
                    <Link href={`/dashboard/admin/questions/drafts?page=${result.page + 1}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      Next <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DraftsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <DraftsContent searchParams={searchParams} />
    </Suspense>
  );
}
