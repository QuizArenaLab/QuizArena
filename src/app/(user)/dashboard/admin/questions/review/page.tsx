import { Suspense } from "react";
import Link from "next/link";
import { getQuestions } from "@/features/admin/services/question-bank";
import { QuestionStatusBadge } from "@/features/admin/components/question-bank/QuestionStatusBadge";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { ReviewQueueClient } from "./ReviewQueueClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Queue | Question Bank",
  description: "Quality control layer for question review and approval",
};

async function ReviewQueueContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const result = await getQuestions({
    status: "REVIEW",
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Queue</h1>
          <p className="text-sm text-gray-500 mt-1">
            {result.total} question{result.total !== 1 ? "s" : ""} awaiting review
          </p>
        </div>
      </div>

      <ReviewQueueClient
        questions={JSON.parse(JSON.stringify(result.questions))}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
      />
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
            <p className="text-sm text-gray-500">Loading Review Queue…</p>
          </div>
        </div>
      }
    >
      <ReviewQueueContent searchParams={searchParams} />
    </Suspense>
  );
}
