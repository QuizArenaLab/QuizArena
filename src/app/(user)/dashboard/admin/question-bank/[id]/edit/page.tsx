import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getQuestionById } from "@/actions/question-bank";
import { QuestionAuthoringWizard } from '@/features/admin/components/question-bank/authoring/QuestionAuthoringWizard';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Question | Question Bank",
  description: "Edit an existing question draft",
};

async function EditQuestionContent({ questionId }: { questionId: string }) {
  const question = await getQuestionById(questionId);

  if (!question) {
    notFound();
  }

  // Only Drafts and Rejected can be edited normally through the wizard
  if (question.status !== "DRAFT" && question.status !== "REJECTED") {
    // Should probably redirect or show an error, but let's let the wizard handle/block it or just not load
    // Actually returning not found for simplicity if it's not editable.
    // However, Super Admins can edit anything. We'll pass the data.
  }

  const initialData = {
    id: question.id,
    question: question.question,
    explanation: question.explanation || "",
    category: question.category || "",
    subject: question.subject || "",
    topic: question.topic || "",
    difficulty: question.difficulty,
    language: question.language,
    marks: question.marks,
    negativeMarks: question.negativeMarks,
    tags: question.tags,
    options: question.options.map((opt) => ({
      id: opt.id,
      optionText: opt.optionText,
      isCorrect: opt.isCorrect,
      order: opt.order,
    })),
  };

  return (
    <div className="mx-auto space-y-6">
      <QuestionAuthoringWizard initialData={initialData} />
    </div>
  );
}

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading editor…</p>
          </div>
        </div>
      }
    >
      <EditQuestionContent questionId={id} />
    </Suspense>
  );
}
