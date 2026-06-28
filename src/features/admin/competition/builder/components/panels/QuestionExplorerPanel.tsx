"use client";

import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Search, Filter, Loader2, Plus, ArrowRightLeft } from "lucide-react";
import { searchQuestionBank } from "../../actions/question-bank.actions";
import { useBuilderStore } from "../../context/useBuilderStore";
import { QuestionStatus } from "@/generated/prisma";
import { BuilderQuestion } from "../../types/builder.types";

export function QuestionExplorerPanel() {
  const [query, setQuery] = useState("");
  const { addQuestion, questions } = useBuilderStore();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
    return {
      url: "question-bank-search",
      query,
      cursor: previousPageData ? previousPageData.nextCursor : undefined,
    };
  };

  const fetcher = async (params: any) => {
    const res = await searchQuestionBank({
      query: params.query,
      limit: 20,
      status: QuestionStatus.APPROVED,
      cursor: params.cursor,
    });
    if (!res.success) throw new Error(res.error);
    return res;
  };

  const { data, size, setSize, isValidating, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
  });

  const allQuestions = data ? data.flatMap((page) => page.data || []) : [];
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor === undefined);

  const handleAddQuestion = (q: any) => {
    // Basic append to default section for now
    const builderQuestion: BuilderQuestion = {
      // eslint-disable-next-line react-hooks/purity
      id: `temp_${Date.now()}`,
      questionId: q.id,
      sectionId: "default",
      displayOrder: Object.keys(questions).length,
      config: {
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        isBonus: false,
        isMandatory: true,
        difficultyOverride: null,
        timeLimitOverride: null,
      },
      original: {
        question: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        healthScore: q.healthScore,
        usageCount: q.usageCount,
      },
    };
    addQuestion(builderQuestion);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Question Explorer</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          </div>
        )}

        {allQuestions.map((q) => {
          // simple check to see if already in builder
          const isAdded = Object.values(questions).some((bq) => bq.questionId === q.id);

          return (
            <div
              key={q.id}
              className="p-3 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {q.questionCode || "NO CODE"}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${q.difficulty === "BEGINNER" ? "bg-green-50 text-green-700" : q.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}
                >
                  {q.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-medium line-clamp-2 mb-3">{q.question}</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span>{q.marks}M</span>
                  <span>{q.usageCount} uses</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAddQuestion(q)}
                    disabled={isAdded}
                    className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold ${isAdded ? "bg-gray-100 text-gray-400" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {isAdded ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!isReachingEnd && (
          <button
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg"
          >
            {isValidating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Load More"}
          </button>
        )}

        {isEmpty && !isLoading && (
          <div className="text-center py-10 text-gray-500 text-sm">No questions found.</div>
        )}
      </div>
    </div>
  );
}
