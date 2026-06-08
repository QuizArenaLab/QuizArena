"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

export function PreviewStep() {
  const { control } = useFormContext();
  const formData = useWatch({ control });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Question Preview</h2>

        {/* Question Info / Metadata */}
        <div className="flex flex-wrap gap-3 mb-6 text-xs text-gray-500 font-medium">
          <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
            {formData.category || "No Category"}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
            {formData.subject || "No Subject"}
          </span>
          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
            {formData.difficulty || "MEDIUM"}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
            +{formData.marks || 1} / -{formData.negativeMarks || 0} Marks
          </span>
        </div>

        {/* The Question Text */}
        <div className="prose prose-sm max-w-none text-gray-800 mb-8 whitespace-pre-wrap text-base">
          {formData.question || (
            <span className="text-gray-400 italic">No question text provided...</span>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {(formData.options || []).map((opt: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                opt.isCorrect ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  opt.isCorrect
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {opt.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{String.fromCharCode(65 + idx)}</span>
                )}
              </div>
              <div
                className={`flex-1 text-sm ${opt.isCorrect ? "font-medium text-emerald-900" : "text-gray-700"}`}
              >
                {opt.optionText || <span className="text-gray-400 italic">Empty option</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        {formData.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
              Explanation
            </h4>
            <p className="text-sm text-blue-900 whitespace-pre-wrap">{formData.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
