"use client";

import { useState, useEffect } from "react";
import { getQuestionAuditHistory, type QuestionAuditWithActor } from "@/features/admin/services/question-bank";
import { History, Loader2, User, Clock, AlertCircle } from "lucide-react";

export function QuestionModerationHistory({ questionId }: { questionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<QuestionAuditWithActor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (history.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getQuestionAuditHistory(questionId);
      setHistory(data);
    } catch (err) {
      setError("Failed to load moderation history");
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => {
    if (!isOpen) fetchHistory();
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <button
        onClick={toggleOpen}
        className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <History className="w-4 h-4" />
        {isOpen ? "Hide Moderation History" : "View Moderation History"}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading history...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-sm text-gray-500 italic">No governance history found.</div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {history.map((audit) => (
                <div
                  key={audit.id}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-slate-200 bg-white shadow-sm text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 text-xs">
                        {audit.action.replace(/_/g, " ")}
                      </span>
                      <time className="text-[10px] font-medium text-indigo-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="text-xs text-slate-500">
                      By: {audit.actor?.name || audit.actor?.email || "System"}
                    </div>
                    {audit.reason && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-700 italic border border-slate-100">
                        &quot;{audit.reason}&quot;
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
