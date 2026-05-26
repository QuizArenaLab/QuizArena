import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { getChallenges } from "@/actions/manage/challenge-management";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
  LIVE: "bg-green-50 text-green-700 border-green-200",
  ENDED: "bg-purple-50 text-purple-700 border-purple-200",
  ARCHIVED: "bg-red-50 text-red-700 border-red-200",
};

const DIFFICULTY_STYLES = {
  EASY: "text-green-600",
  MEDIUM: "text-amber-600",
  HARD: "text-red-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  SSC: "SSC",
  BANKING: "Banking",
  RAILWAYS: "Railways",
  STATE_PSC: "State PSC",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

async function ChallengeList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const result = await getChallenges({
    search,
    status,
    difficulty,
    category,
    page,
    limit: 20,
  });

  const { challenges, total, totalPages } = result;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and organize your challenge pool</p>
        </div>
        <Link
          href={ROUTES.MODERATOR.CHALLENGE_CREATE}
          className="inline-flex items-center px-4 py-2 bg-[#6366F1] text-white text-sm font-medium rounded-lg hover:bg-[#4F46E5] transition-colors"
        >
          Create Challenge
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
                placeholder="Search challenges..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>
            <select
              name="status"
              defaultValue={status || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="DRAFT">Review</option>
              <option value="LIVE">Published</option>
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
            <select
              name="category"
              defaultValue={category || ""}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="SSC">SSC</option>
              <option value="BANKING">Banking</option>
              <option value="RAILWAYS">Railways</option>
              <option value="STATE_PSC">State PSC</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {challenges.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-500 mb-4">
              {search || status || difficulty || category
                ? "Try adjusting your filters"
                : "Create your first challenge to get started"}
            </p>
            <Link
              href={ROUTES.MODERATOR.CHALLENGE_CREATE}
              className="inline-flex items-center px-4 py-2 bg-[#6366F1] text-white text-sm font-medium rounded-lg hover:bg-[#4F46E5] transition-colors"
            >
              Create Challenge
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duration
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
                  {challenges.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {challenge.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{challenge.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            STATUS_STYLES[challenge.status as keyof typeof STATUS_STYLES]
                          )}
                        >
                          {challenge.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {(challenge as any).category
                          ? CATEGORY_LABELS[(challenge as any).category] ||
                            (challenge as any).category
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            DIFFICULTY_STYLES[
                              challenge.difficulty as keyof typeof DIFFICULTY_STYLES
                            ]
                          )}
                        >
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {challenge._count.questions} / {challenge.totalQuestions}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {challenge.durationInMinutes} min
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(challenge.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={ROUTES.MODERATOR.CHALLENGE_EDIT(challenge.id)}
                            className="text-sm text-[#6366F1] hover:text-[#4F46E5] font-medium"
                          >
                            Edit
                          </Link>
                          {challenge.status === "DRAFT" && <span className="text-gray-300">|</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}{" "}
                  challenges
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`?page=${page - 1}${search ? `&search=${search}` : ""}${
                        status ? `&status=${status}` : ""
                      }${difficulty ? `&difficulty=${difficulty}` : ""}${
                        category ? `&category=${category}` : ""
                      }`}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`?page=${page + 1}${search ? `&search=${search}` : ""}${
                        status ? `&status=${status}` : ""
                      }${difficulty ? `&difficulty=${difficulty}` : ""}${
                        category ? `&category=${category}` : ""
                      }`}
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

export default function ModeratorChallengesPage({
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
      <ChallengeList searchParams={searchParams} />
    </Suspense>
  );
}
