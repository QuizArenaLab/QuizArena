import { Suspense } from "react";
import { getQuestions } from "@/features/admin/services/question-bank";
import { ArchiveClient } from "./ArchiveClient";
import { Archive } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archived Questions | Question Bank",
  description: "View and manage archived questions",
};

async function ArchiveContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10);

  const result = await getQuestions({
    status: "ARCHIVED",
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Archived Questions</h1>
        <p className="text-sm text-gray-500 mt-1">
          {result.total} archived question{result.total !== 1 ? "s" : ""}. Restore to move back to
          Drafts.
        </p>
      </div>

      {result.questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Archive className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No archived questions</p>
        </div>
      ) : (
        <ArchiveClient
          questions={JSON.parse(JSON.stringify(result.questions))}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
        />
      )}
    </div>
  );
}

export default function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <ArchiveContent searchParams={searchParams} />
    </Suspense>
  );
}
