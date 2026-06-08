import { requireAdmin } from "@/features/rbac/services/guards";
import { prisma } from "@/lib/prisma";
import { QuestionBankSubNav } from "@/features/admin/components/question-bank/QuestionBankSubNav";
import { Database } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Bank | QuizArena Admin",
  description: "Complete question lifecycle management system",
};

export default async function QuestionsLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin("/dashboard");

  // Fetch review count for the badge
  const reviewCount = await prisma.question.count({
    where: { status: "REVIEW" },
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Question Bank Operations
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Command center for content curation, review queues, and publishing pipelines.
              </p>
            </div>
          </div>
        </div>
        <QuestionBankSubNav reviewCount={reviewCount} />
        <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
