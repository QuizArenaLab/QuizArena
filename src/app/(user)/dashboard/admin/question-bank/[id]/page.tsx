// @ts-nocheck
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuestionById, getQuestionAuditHistory } from "@/features/admin/services/question-bank";
import { QuestionDetailView } from "@/features/admin/components/question-bank/QuestionDetailView";
import { QuestionAuditTimeline } from "@/features/admin/components/question-bank/QuestionAuditTimeline";
import { getQuestionIntelligence } from "@/features/admin/services/question-bank/usage-intelligence";
import { auth } from "@/auth/auth";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Details | Question Bank",
  description: "Governance details, performance intelligence, and audit trail for a question",
};

async function QuestionDetailContent({ questionId }: { questionId: string }) {
  const session = await auth();
  const userRole = (session?.user?.role as string) || "USER";

  const [question, audits, intelligence] = await Promise.all([
    getQuestionById(questionId),
    getQuestionAuditHistory(questionId),
    getQuestionIntelligence(questionId).catch(() => null),
  ]);

  if (!question) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.ADMIN.QUESTION_BANK}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Question Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Governance, performance intelligence, and usage metrics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuestionDetailView question={question} userRole={userRole} intelligence={intelligence} />
        </div>
        <div className="space-y-6">
          <QuestionAuditTimeline audits={audits} />
        </div>
      </div>
    </div>
  );
}

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading details…</p>
          </div>
        </div>
      }
    >
      <QuestionDetailContent questionId={id} />
    </Suspense>
  );
}
