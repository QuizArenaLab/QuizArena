"use client";

import { useQuestionAuthoringStore } from "@/features/admin/store/question-authoring";
import { CheckCircle2, Plus, Trash2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { checkDuplicateLive } from "@/features/admin/services/question-bank";

export function ContentStep() {
  const { formData, setFormData, updateOption, addOption, removeOption } =
    useQuestionAuthoringStore();

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!formData.question || formData.question.length < 10) {
        setDuplicateWarning(null);
        return;
      }
      const res = await checkDuplicateLive(formData.question, formData.category, formData.id);
      if (res.isDuplicate) {
        setDuplicateWarning(
          `An identical question already exists (${res.duplicateCode || "Unknown ID"}).`
        );
      } else if (res.isNearDuplicate) {
        setDuplicateWarning(
          `A highly similar question exists (${res.duplicateCode || "Unknown ID"}). Please verify this is not a duplicate.`
        );
      } else {
        setDuplicateWarning(null);
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [formData.question, formData.category, formData.id]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Question Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
          Question Content
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.question || ""}
              onChange={(e) => setFormData({ question: e.target.value })}
              rows={4}
              maxLength={2000}
              placeholder="Enter the question text…"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
            <div className="flex items-center justify-between mt-1">
              {duplicateWarning ? (
                <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {duplicateWarning}
                </div>
              ) : (
                <div />
              )}
              <p className="text-[11px] text-gray-400 text-right">
                {(formData.question || "").length}/2000
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Explanation</label>
            <textarea
              value={formData.explanation || ""}
              onChange={(e) => setFormData({ explanation: e.target.value })}
              rows={3}
              maxLength={3000}
              placeholder="Provide a detailed explanation for the correct answer…"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Answer Options
          </h3>
          <span className="text-xs text-gray-400">Select the correct answer</span>
        </div>

        <div className="space-y-3">
          {(formData.options || []).map((opt, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                opt.isCorrect
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                type="button"
                onClick={() => updateOption(index, "isCorrect", true)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  opt.isCorrect
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <span className="text-xs font-bold text-gray-400 w-6 text-center shrink-0">
                {String.fromCharCode(65 + index)}
              </span>

              <input
                type="text"
                value={opt.optionText || ""}
                onChange={(e) => updateOption(index, "optionText", e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />

              {(formData.options || []).length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {(formData.options || []).length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        )}
      </div>
    </div>
  );
}
