"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { approveQuestion, rejectQuestion } from "@/features/admin/services/question-bank";
import { BulkActionToolbar } from "@/features/admin/components/question-bank/BulkActionToolbar";

interface ReviewQuestion {
  id: string;
  questionCode: string | null;
  question: string;
  category: string | null;
  subject: string | null;
  difficulty: string;
  createdAt: string;
  createdBy: { id: string; name: string | null; email: string | null } | null;
}

interface ReviewQueueClientProps {
  questions: ReviewQuestion[];
  total: number;
  page: number;
  totalPages: number;
}

export function ReviewQueueClient({ questions, total, page, totalPages }: ReviewQueueClientProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q.id));
    }
  };

  const handleApprove = (id: string) => {
    setActionPending(id);
    startTransition(async () => {
      await approveQuestion(id);
      setActionPending(null);
      router.refresh();
    });
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    setActionPending(id);
    startTransition(async () => {
      await rejectQuestion(id, rejectReason);
      setRejectingId(null);
      setRejectReason("");
      setActionPending(null);
      router.refresh();
    });
  };

  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HARDCORE: "bg-red-100 text-red-800",
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Review Queue is Clear</h3>
        <p className="text-sm text-gray-500 mt-1">All questions have been reviewed. Great work!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BulkActionToolbar
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onComplete={() => {
          setSelectedIds([]);
          router.refresh();
        }}
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === questions.length && questions.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Created By
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(q.id)}
                    onChange={() => toggleSelect(q.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-0.5">
                      {q.questionCode || q.id.slice(0, 8)}
                    </span>
                    <p className="text-sm text-gray-900 line-clamp-2">{q.question}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-gray-600">{q.subject || "—"}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${difficultyColors[q.difficulty] || "bg-gray-100 text-gray-800"}`}
                  >
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-gray-500">{q.createdBy?.name || "Unknown"}</span>
                </td>
                <td className="px-4 py-3">
                  {rejectingId === q.id ? (
                    <div className="flex items-center gap-2 justify-end">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason..."
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 w-40 focus:outline-none focus:ring-1 focus:ring-red-400"
                      />
                      <button
                        onClick={() => handleReject(q.id)}
                        disabled={isPending}
                        className="text-xs font-medium text-white bg-red-600 px-2 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionPending === q.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Reject"
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => handleApprove(q.id)}
                        disabled={isPending && actionPending === q.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                      >
                        {actionPending === q.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingId(q.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages} · {total} total
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/admin/questions/review?page=${page - 1}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/admin/questions/review?page=${page + 1}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
