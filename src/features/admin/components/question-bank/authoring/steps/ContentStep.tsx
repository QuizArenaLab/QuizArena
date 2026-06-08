"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { CheckCircle2, Plus, Trash2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { checkDuplicateLive } from "@/features/admin/services/question-bank";

export function ContentStep() {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();
  const formData = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!formData.question || formData.question.length < 10) {
        setDuplicateWarning(null);
        return;
      }
      const res = await checkDuplicateLive(
        {
          question: formData.question,
          category: formData.category,
          subject: formData.subject,
          explanation: formData.explanation,
          options: formData.options,
        } as any,
        formData.id
      );
      if (res.status === "EXACT") {
        setDuplicateWarning(
          `An identical question already exists (${res.candidates[0]?.questionCode || "Unknown ID"}).`
        );
      } else if (res.status === "SIMILAR") {
        setDuplicateWarning(
          `A highly similar question exists (${res.candidates[0]?.questionCode || "Unknown ID"}). Please verify this is not a duplicate.`
        );
      } else {
        setDuplicateWarning(null);
      }
    }, 1500);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.question, formData.category, formData.id]);

  const setCorrectOption = (index: number) => {
    const currentOptions = formData.options || [];
    const newOptions = currentOptions.map((opt: any, i: number) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setValue("options", newOptions, { shouldValidate: true, shouldDirty: true });
  };

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
              {...register("question")}
              rows={4}
              maxLength={2000}
              placeholder="Enter the question text…"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y ${errors.question ? "border-red-300" : "border-gray-300"}`}
            />
            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-col gap-1">
                {errors.question && (
                  <span className="text-xs text-red-500">{(errors.question as any).message}</span>
                )}
                {duplicateWarning && (
                  <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {duplicateWarning}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 text-right">
                {(formData.question || "").length}/2000
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Explanation</label>
            <textarea
              {...register("explanation")}
              rows={3}
              maxLength={3000}
              placeholder="Provide a detailed explanation for the correct answer…"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y ${errors.explanation ? "border-red-300" : "border-gray-300"}`}
            />
            {errors.explanation && (
              <span className="text-xs text-red-500 mt-1">
                {(errors.explanation as any).message}
              </span>
            )}
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

        {errors.options && typeof errors.options.message === "string" && (
          <div className="mb-4 text-xs text-red-500 font-medium">{errors.options.message}</div>
        )}

        <div className="space-y-3">
          {fields.map((opt, index) => {
            const isCorrect = formData.options?.[index]?.isCorrect;
            const optErrors = (errors.options as any)?.[index];
            return (
              <div key={opt.id} className="space-y-1">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isCorrect
                      ? "border-emerald-300 bg-emerald-50/50"
                      : optErrors
                        ? "border-red-200 bg-red-50/20"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectOption(index)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>

                  <span className="text-xs font-bold text-gray-400 w-6 text-center shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <input
                    type="text"
                    {...register(`options.${index}.optionText`)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${optErrors ? "border-red-300" : "border-gray-200"}`}
                  />

                  {fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {optErrors?.optionText && (
                  <p className="text-xs text-red-500 ml-16">{optErrors.optionText.message}</p>
                )}
              </div>
            );
          })}
        </div>

        {fields.length < 6 && (
          <button
            type="button"
            onClick={() => append({ optionText: "", isCorrect: false, order: fields.length })}
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
