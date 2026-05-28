import { Suspense } from "react";
import Link from "next/link";
import { getQuestions } from "@/actions/question-bank";
import { QuestionReviewCard } from "@/components/question-bank/QuestionReviewCard";
import { ReviewQueueTabs } from "@/components/question-bank/ReviewQueueTabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance Queue | Question Bank",
  description: "Enterprise question governance and moderation queue",
};

async function ReviewQueueContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "REVIEW";
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);
  const limit = 20;

  const result = await getQuestions({ status, page, limit });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Governance Queue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Institutional quality-control and governance layer for production questions.
        </p>
      </div>

      <ReviewQueueTabs />

      {result.questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <span className="text-2xl text-gray-400">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Queue is empty</h3>
          <p className="text-gray-500">There are no questions in this queue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm font-medium text-gray-500">
            Showing {result.questions.length} of {result.total} questions
          </div>

          <div className="space-y-4">
            {result.questions.map((q) => (
              <QuestionReviewCard
                key={q.id}
                question={{
                  id: q.id,
                  questionCode: q.questionCode,
                  question: q.question,
                  explanation: q.explanation || null,
                  version: q.version,
                  subject: q.subject,
                  category: q.category,
                  difficulty: q.difficulty,
                  status: q.status,
                  marks: q.marks,
                  createdBy: q.createdBy,
                  createdAt: q.createdAt,
                  options: q.options,
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl">
              <div className="flex flex-1 justify-between sm:hidden">
                <Link
                  href={`?status=${status}&page=${page > 1 ? page - 1 : 1}`}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  Previous
                </Link>
                <Link
                  href={`?status=${status}&page=${page < result.totalPages ? page + 1 : result.totalPages}`}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page >= result.totalPages ? "pointer-events-none opacity-50" : ""}`}
                >
                  Next
                </Link>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(page * limit, result.total)}</span> of{" "}
                    <span className="font-medium">{result.total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <Link
                      href={`?status=${status}&page=${page > 1 ? page - 1 : 1}`}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                      Page {page} of {result.totalPages}
                    </div>
                    <Link
                      href={`?status=${status}&page=${page < result.totalPages ? page + 1 : result.totalPages}`}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page >= result.totalPages ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewQueuePage({
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
            <p className="text-sm text-gray-500">Loading Governance Queue…</p>
          </div>
        </div>
      }
    >
      <ReviewQueueContent searchParams={searchParams} />
    </Suspense>
  );
}
