import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';
import { getQuestions } from "@/features/admin/services/question-management";
import { COMMON_SUBJECTS } from "@/lib/validations/question";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ARCHIVED: "bg-slate-50 text-slate-700 border-slate-200",
};

const DIFFICULTY_STYLES = {
  EASY: "text-green-600",
  MEDIUM: "text-amber-600",
  HARD: "text-red-600",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

async function QuestionList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const subject = typeof params.subject === "string" ? params.subject : undefined;
  const topic = typeof params.topic === "string" ? params.topic : undefined;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const result = await getQuestions({
    search,
    subject,
    topic,
    difficulty,
    status,
    page,
    limit: 20,
  });

  const { questions, total, totalPages } = result;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your reusable question pool</p>
        </div>
        <Link
          href={ROUTES.MODERATOR.QUESTION_CREATE}
          className="inline-flex items-center px-4 py-2 bg-[#6366F1] text-white text-sm font-medium rounded-lg hover:bg-[#4F46E5] transition-colors"
        >
          Create Question
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <form method="GET" className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search questions..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>
            <select
              name="subject"
              defaultValue={subject || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
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
              defaultValue={status || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="DRAFT">Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select
              name="difficulty"
              defaultValue={difficulty || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            >
              <option value="">All Difficulty</option>
              <option value="BEGINNER">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARDCORE">Hard</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {questions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500 mb-4">
              {search || subject || status || difficulty
                ? "Try adjusting your filters"
                : "Create your first question to get started"}
            </p>
            <Link
              href={ROUTES.MODERATOR.QUESTION_CREATE}
              className="inline-flex items-center px-4 py-2 bg-[#6366F1] text-white text-sm font-medium rounded-lg hover:bg-[#4F46E5] transition-colors"
            >
              Create Question
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {questions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900 line-clamp-2 text-sm">
                          {truncate(question.question, 80)}
                        </p>
                        {question.topic && (
                          <p className="text-xs text-gray-500 mt-1">Topic: {question.topic}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{question.subject || "-"}</td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            STATUS_STYLES[question.status as keyof typeof STATUS_STYLES]
                          )}
                        >
                          {question.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            DIFFICULTY_STYLES[question.difficulty as keyof typeof DIFFICULTY_STYLES]
                          )}
                        >
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {question.marks}
                        {question.negativeMarks > 0 && (
                          <span className="text-red-500 text-xs ml-1">
                            (-{question.negativeMarks * 100}%)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(question.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={ROUTES.MODERATOR.QUESTION_EDIT(question.id)}
                          className="text-sm text-[#6366F1] hover:text-[#4F46E5] font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} questions
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`?page=${page - 1}${search ? `&search=${search}` : ""}${
                        subject ? `&subject=${subject}` : ""
                      }${status ? `&status=${status}` : ""}${difficulty ? `&difficulty=${difficulty}` : ""}`}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`?page=${page + 1}${search ? `&search=${search}` : ""}${
                        subject ? `&subject=${subject}` : ""
                      }${status ? `&status=${status}` : ""}${difficulty ? `&difficulty=${difficulty}` : ""}`}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Next
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

export default function ModeratorQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <QuestionList searchParams={searchParams} />
    </Suspense>
  );
}
