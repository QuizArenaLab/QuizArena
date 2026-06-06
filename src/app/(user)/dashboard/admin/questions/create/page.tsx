import { QuestionForm } from "@/features/admin/components/question-bank/QuestionForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Question | Question Bank",
  description: "Manually author a new question",
};

export default function CreateQuestionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Question</h1>
        <p className="text-sm text-gray-500 mt-1">
          Author a new question. All new questions enter as Draft and require review before publishing.
        </p>
      </div>
      <QuestionForm />
    </div>
  );
}
