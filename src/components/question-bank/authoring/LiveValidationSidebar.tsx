"use client";

import { useQuestionAuthoringStore } from "@/store/question-authoring";
import { useEffect, useState } from "react";
import { validateQuestionLive } from "@/actions/question-bank";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function LiveValidationSidebar() {
  const { formData, setValidationErrors } = useQuestionAuthoringStore();
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setIsValidating(true);
      const res = await validateQuestionLive(formData);
      setErrors(res.errors);
      setValidationErrors(res.errors);
      setIsValidating(false);
    }, 1000); // 1s debounce for validation

    return () => clearTimeout(handler);
  }, [formData, setValidationErrors]);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 h-full overflow-y-auto">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
        Pre-Flight Checks
      </h3>

      {isValidating && (
        <div className="text-xs text-gray-500 mb-4 animate-pulse">Validating...</div>
      )}

      {!isValidating && errors.length === 0 && (
        <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 font-medium">
            All checks passed! Question is ready for review.
          </p>
        </div>
      )}

      {!isValidating && errors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-red-600 mb-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-xs font-bold">Requires Attention:</span>
          </div>
          <ul className="space-y-2">
            {errors.map((error, idx) => (
              <li
                key={idx}
                className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100"
              >
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Checklist</h4>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${formData.category ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            Category Selected
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${formData.subject ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            Subject Selected
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${(formData.question?.length || 0) >= 10 ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            Question length {">="} 10 chars
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${(formData.options?.length || 0) >= 2 ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            At least 2 options
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${formData.options?.filter((o) => o.isCorrect).length === 1 ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            Exactly 1 correct option
          </li>
        </ul>
      </div>
    </div>
  );
}
