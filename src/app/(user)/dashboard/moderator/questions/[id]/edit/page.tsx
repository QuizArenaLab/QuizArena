import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';
import {
  getQuestionById,
  moveToReview,
  approveQuestion,
  rejectQuestion,
  archiveQuestion,
} from '@/features/admin/services/question-management';
import { requireMinimumRole } from '@/features/rbac/components/RoleGuard';
import { ROLE as ROLES } from '@/features/rbac/constants/role-types';
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ARCHIVED: "bg-slate-50 text-slate-700 border-slate-200",
};

const STATUS_TRANSITIONS = {
  DRAFT: [{ label: "Submit for Review", action: "review", allowed: true }],
  REVIEW: [
    { label: "Return to Draft", action: "draft", allowed: true },
    { label: "Approve", action: "approve", allowed: true },
    { label: "Reject", action: "reject", allowed: true },
  ],
  APPROVED: [{ label: "Archive", action: "archive", allowed: true }],
  REJECTED: [{ label: "Return to Draft", action: "draft", allowed: true }],
  ARCHIVED: [{ label: "Restore to Draft", action: "draft", allowed: true }],
};

async function QuestionEditContent({ questionId }: { questionId: string }) {
  await requireMinimumRole(ROLES.MODERATOR);

  const question = await getQuestionById(questionId);

  if (!question) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={ROUTES.MODERATOR.QUESTIONS}
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
          Back to Questions
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Question</h1>
            <p className="text-sm text-gray-500 mt-1">Question ID: {question.id}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
              STATUS_STYLES[question.status as keyof typeof STATUS_STYLES]
            )}
          >
            {question.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Question</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{question.question}</p>
          </div>

          {question.explanation && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Explanation</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{question.explanation}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    option.isCorrect ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      option.isCorrect ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-gray-900">{option.optionText}</span>
                  {option.isCorrect && (
                    <span className="text-green-600 text-sm font-medium">Correct</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Actions</h2>
            <div className="space-y-3">
              {STATUS_TRANSITIONS[question.status as keyof typeof STATUS_TRANSITIONS]?.map(
                (transition) => (
                  <form
                    key={transition.action}
                    action={async () => {
                      "use server";
                      let result;
                      switch (transition.action) {
                        case "review":
                          result = await moveToReview(questionId);
                          break;
                        case "approve":
                          result = await approveQuestion(questionId);
                          break;
                        case "reject":
                          result = await rejectQuestion(questionId);
                          break;
                        case "archive":
                          result = await archiveQuestion(questionId);
                          break;
                        case "draft":
                          result = await updateQuestionStatus({
                            id: questionId,
                            newStatus: "DRAFT",
                          });
                          break;
                      }
                      if (result?.success) {
                        redirect(ROUTES.MODERATOR.QUESTIONS);
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className={cn(
                        "w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        transition.action === "approve"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : transition.action === "reject"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : transition.action === "archive"
                              ? "bg-slate-600 text-white hover:bg-slate-700"
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Info</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Subject</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {question.subject || "Not set"}
                </dd>
              </div>
              {question.topic && (
                <div>
                  <dt className="text-xs text-gray-500">Topic</dt>
                  <dd className="text-sm font-medium text-gray-900">{question.topic}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500">Difficulty</dt>
                <dd className="text-sm font-medium text-gray-900">{question.difficulty}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Marks</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {question.marks}
                  {question.negativeMarks > 0 && (
                    <span className="text-red-500 text-xs ml-1">
                      (-{question.negativeMarks * 100}%)
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(question.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last Updated</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(question.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Used in Challenges</dt>
                <dd className="text-sm font-medium text-gray-900">{question._count.challenges}</dd>
              </div>
              {question.createdBy && (
                <div>
                  <dt className="text-xs text-gray-500">Created By</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {question.createdBy.name || question.createdBy.email}
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

async function updateQuestionStatus(data: { id: string; newStatus: string }) {
  "use server";
  const { updateQuestionStatus } = await import("@/actions/manage/question-management");
  return updateQuestionStatus(data);
}

export default async function QuestionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuestionEditContent questionId={id} />;
}
