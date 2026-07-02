"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, Trash2 } from "lucide-react";
import {
  searchApprovedQuestions,
  addQuestionToChallenge,
  removeQuestionFromChallenge,
} from "@/features/admin/services/challenge-builder";
import { notify } from '@/shared/feedback/notify';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export default function QuestionDiscoveryPanel({ challenge }: { challenge: any }) {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const selectedQuestionIds = new Set(challenge.questions.map((q: any) => q.questionId));

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await searchApprovedQuestions({ search, limit: 20 });
      setQuestions(res.questions);
    } catch (error) {
      notify.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleAdd = async (qId: string) => {
    setAddingId(qId);
    const toastId = notify.loading("Adding Question...");
    try {
      const res = await addQuestionToChallenge({ challengeId: challenge.id, questionId: qId });
      if (res.success) {
        notify.success("Question added", { id: toastId });
      } else {
        notify.error(res.error || "Failed to add question", { id: toastId });
      }
    } catch {
      notify.error("Failed to add question", { id: toastId });
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (qId: string) => {
    const toastId = notify.loading("Removing Question...");
    try {
      const res = await removeQuestionFromChallenge({ challengeId: challenge.id, questionId: qId });
      if (res.success) {
        notify.success("Question removed", { id: toastId });
      } else {
        notify.error(res.error || "Failed to remove question", { id: toastId });
      }
    } catch {
      notify.error("Failed to remove question", { id: toastId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Question Selection</h2>
          <p className="text-sm text-muted-foreground">Select from approved questions only.</p>
        </div>
        <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
          {challenge.questions.length} Selected
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code, content, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No approved questions found.
          </div>
        ) : (
          <div className="divide-y">
            {questions.map((q) => {
              const isSelected = selectedQuestionIds.has(q.id);
              return (
                <div
                  key={q.id}
                  className={`p-4 flex items-center justify-between ${isSelected ? "bg-primary/5" : ""}`}
                >
                  <div className="space-y-1 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {q.questionCode || "NO-CODE"}
                      </span>
                      <span className="text-xs border px-2 py-0.5 rounded-full">
                        {q.difficulty}
                      </span>
                      <span className="text-xs border px-2 py-0.5 rounded-full">
                        {q.subject || q.category}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{q.question}</p>
                  </div>
                  <div>
                    {isSelected ? (
                      <Button variant="destructive" size="sm" onClick={() => handleRemove(q.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdd(q.id)}
                        disabled={addingId === q.id}
                      >
                        {addingId === q.id ? (
                          "Adding..."
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" /> Add
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
