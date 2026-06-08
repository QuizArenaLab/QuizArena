"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Trash2, Loader2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import {
  restoreArchivedQuestion,
  permanentlyDeleteQuestion,
} from "@/features/admin/services/question-bank";

interface ArchivedQuestion {
  id: string;
  questionCode: string | null;
  question: string;
  category: string | null;
  subject: string | null;
  difficulty: string;
  createdAt: string;
  createdBy: { id: string; name: string | null; email: string | null } | null;
}

interface ArchiveClientProps {
  questions: ArchivedQuestion[];
  total: number;
  page: number;
  totalPages: number;
}

export function ArchiveClient({ questions, total, page, totalPages }: ArchiveClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleRestore = (id: string) => {
    setActionId(id);
    startTransition(async () => {
      await restoreArchivedQuestion(id);
      setActionId(null);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    setActionId(id);
    startTransition(async () => {
      const result = await permanentlyDeleteQuestion(id);
      setDeleteConfirmId(null);
      setActionId(null);
      if (!result.success) {
        alert(result.error || "Failed to delete");
      }
      router.refresh();
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Question
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Category
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Created By
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Date
            </th>
            <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-3.5">
                <span className="text-[10px] font-bold text-gray-400 block mb-0.5">
                  {q.questionCode || q.id.slice(0, 8)}
                </span>
                <p className="text-sm text-gray-900 line-clamp-2 max-w-md">{q.question}</p>
              </td>
              <td className="px-5 py-3.5 hidden md:table-cell">
                <span className="text-xs text-gray-600">{q.category || "—"}</span>
              </td>
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <span className="text-xs text-gray-500">{q.createdBy?.name || "—"}</span>
              </td>
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <span className="text-xs text-gray-400">
                  {new Date(q.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1.5 justify-end">
                  {deleteConfirmId === q.id ? (
                    <>
                      <span className="text-xs text-red-600 mr-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Permanent
                      </span>
                      <button
                        onClick={() => handleDelete(q.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionId === q.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRestore(q.id)}
                        disabled={isPending && actionId === q.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                      >
                        {actionId === q.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        Restore
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(q.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/dashboard/admin/questions/archive?page=${page - 1}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-3 h-3" /> Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/dashboard/admin/questions/archive?page=${page + 1}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Next <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
