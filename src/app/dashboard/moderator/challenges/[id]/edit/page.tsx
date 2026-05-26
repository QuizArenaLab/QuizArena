import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import {
  getChallengeById,
  getChallengeQuestions,
  getAvailableQuestionsForChallenge,
  validateChallengeForPublishing,
  addQuestionToChallenge,
  removeQuestionFromChallenge,
  moveToReview,
  publishChallenge,
  archiveChallenge,
} from "@/actions/manage/challenge-management";
import { requireMinimumRole } from "@/lib/rbac/guards";
import { ROLES } from "@/lib/rbac/roles";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  PUBLISHED: "bg-green-50 text-green-700 border-green-200",
  ARCHIVED: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_TRANSITIONS = {
  DRAFT: [{ label: "Submit for Review", action: "review", allowed: true }],
  REVIEW: [
    { label: "Return to Draft", action: "draft", allowed: true },
    { label: "Publish", action: "publish", allowed: true },
  ],
  PUBLISHED: [{ label: "Archive", action: "archive", allowed: true }],
  ARCHIVED: [{ label: "Restore to Draft", action: "draft", allowed: true }],
};

const DIFFICULTY_STYLES = {
  EASY: "text-green-600",
  MEDIUM: "text-amber-600",
  HARD: "text-red-600",
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

async function ChallengeEditContent({
  challengeId,
  searchParams,
}: {
  challengeId: string;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireMinimumRole(ROLES.MODERATOR);

  const challenge = await getChallengeById(challengeId);
  if (!challenge) {
    notFound();
  }

  const params = await searchParams;
  const showAddQuestion = params.addQuestion === "true";
  const validation = await validateChallengeForPublishing(challengeId);
  const questions = await getChallengeQuestions(challengeId);

  const isEditable = challenge.status === "DRAFT" || challenge.status === "REVIEW";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href={ROUTES.MODERATOR.CHALLENGES}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Challenges
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Slug: {challenge.slug}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
              STATUS_STYLES[challenge.status as keyof typeof STATUS_STYLES]
            )}
          >
            {challenge.status}
          </span>
        </div>
      </div>

      {validation.errors.length > 0 && isEditable && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Publishing Validation Failed</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Warnings</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            {validation.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {showAddQuestion && isEditable && <QuestionSelector challengeId={challengeId} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenge Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="font-medium text-gray-900">
                  {(challenge as any).category || "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Difficulty</dt>
                <dd className="font-medium text-gray-900">{challenge.difficulty}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Duration</dt>
                <dd className="font-medium text-gray-900">{challenge.durationInMinutes} minutes</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Total Questions</dt>
                <dd className="font-medium text-gray-900">
                  {challenge._count.questions} / {(challenge as any).totalQuestions}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Total Marks</dt>
                <dd className="font-medium text-gray-900">{(challenge as any).totalMarks}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Negative Marking</dt>
                <dd className="font-medium text-gray-900">
                  {(challenge as any).negativeMarking
                    ? `${(challenge as any).negativeMarkPercentage * 100}%`
                    : "Disabled"}
                </dd>
              </div>
            </dl>
          </div>

          {challenge.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{challenge.description}</p>
            </div>
          )}

          {(challenge as any).instructions && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{(challenge as any).instructions}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Questions ({questions.length})
              </h2>
              {isEditable && (
                <Link
                  href={`?addQuestion=true`}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#4F46E5] transition-colors"
                >
                  Add Questions
                </Link>
              )}
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No questions added yet</p>
                {isEditable && (
                  <Link
                    href={`?addQuestion=true`}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#4F46E5] transition-colors"
                  >
                    Add Questions
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((cq, index) => (
                  <div
                    key={cq.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {truncate(cq.question.question, 150)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{cq.question.subject || "No subject"}</span>
                        <span
                          className={
                            DIFFICULTY_STYLES[
                              cq.question.difficulty as keyof typeof DIFFICULTY_STYLES
                            ]
                          }
                        >
                          {cq.question.difficulty}
                        </span>
                        <span>Marks: {cq.question.marks}</span>
                        {cq.question.negativeMarks > 0 && (
                          <span className="text-red-500">-{cq.question.negativeMarks * 100}%</span>
                        )}
                      </div>
                    </div>
                    {isEditable && (
                      <form
                        action={async () => {
                          "use server";
                          await removeQuestionFromChallenge(challengeId, cq.questionId);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Actions</h2>
            <div className="space-y-3">
              {STATUS_TRANSITIONS[challenge.status as keyof typeof STATUS_TRANSITIONS]?.map(
                (transition) => (
                  <form
                    key={transition.action}
                    action={async () => {
                      "use server";
                      let result;
                      switch (transition.action) {
                        case "review":
                          result = await moveToReview(challengeId);
                          break;
                        case "publish":
                          result = await publishChallenge(challengeId);
                          break;
                        case "archive":
                          result = await archiveChallenge(challengeId);
                          break;
                        case "draft":
                          result = await updateChallengeStatus({
                            id: challengeId,
                            newStatus: "DRAFT",
                          });
                          break;
                      }
                      if (result?.success) {
                        redirect(ROUTES.MODERATOR.CHALLENGES);
                      }
                    }}
                  >
                    <button
                      type="submit"
                      disabled={transition.action === "publish" && !validation.valid}
                      className={cn(
                        "w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        transition.action === "publish"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : transition.action === "archive"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                      )}
                    >
                      {transition.label}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenge Info</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(challenge.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last Updated</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(challenge.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              {challenge.createdAt && (
                <div>
                  <dt className="text-xs text-gray-500">Published</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(challenge.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500">Total Attempts</dt>
                <dd className="text-sm font-medium text-gray-900">{challenge._count.attempts}</dd>
              </div>
              {challenge.createdBy && (
                <div>
                  <dt className="text-xs text-gray-500">Created By</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {challenge.createdBy.name || challenge.createdBy.email}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

async function QuestionSelector({ challengeId }: { challengeId: string }) {
  const result = await getAvailableQuestionsForChallenge(challengeId, {
    search: undefined,
    subject: undefined,
    difficulty: undefined,
    page: 1,
    limit: 20,
  });

  return (
    <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Add Questions</h2>
        <Link
          href={`/dashboard/moderator/challenges/${challengeId}/edit`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search questions... (coming soon)"
          disabled
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
        />
        <select
          disabled
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
        >
          <option value="">All Subjects</option>
        </select>
        <select
          disabled
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
        >
          <option value="">All Difficulty</option>
        </select>
        <button
          type="button"
          disabled
          className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed"
        >
          Filter
        </button>
      </div>

      {result.questions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No questions available to add</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {result.questions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {truncate(q.question, 120)}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>{q.subject || "No subject"}</span>
                  <span
                    className={DIFFICULTY_STYLES[q.difficulty as keyof typeof DIFFICULTY_STYLES]}
                  >
                    {q.difficulty}
                  </span>
                  <span>Marks: {q.marks}</span>
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await addQuestionToChallenge(challengeId, q.id);
                }}
              >
                <button
                  type="submit"
                  className="ml-4 px-3 py-1.5 text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#4F46E5]"
                >
                  Add
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function updateChallengeStatus(data: { id: string; newStatus: string }) {
  "use server";
  const { updateChallengeStatus } = await import("@/actions/manage/challenge-management");
  return updateChallengeStatus(data);
}

export default async function ChallengeEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  return <ChallengeEditContent challengeId={id} searchParams={searchParams} />;
}
