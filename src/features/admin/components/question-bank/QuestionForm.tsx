"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuestion } from "@/features/admin/services/question-bank";
import {
  QUESTION_CATEGORIES,
  COMMON_SUBJECTS,
  LANGUAGE_OPTIONS,
  TAG_PRESETS,
  DIFFICULTY_CONFIG,
} from "@/features/admin/services/question-bank/constants";
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { calculateQuestionHealth } from "@/lib/validations/question-engine";
import { createQuestionSchema, CreateQuestionInput } from "@/lib/validations/question";

export function QuestionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<any>({
    resolver: zodResolver(createQuestionSchema) as any,
    mode: "onChange",
    defaultValues: {
      question: "",
      explanation: "",
      category: "",
      subject: "",
      topic: "",
      difficulty: "MEDIUM",
      language: "en",
      marks: 1,
      negativeMarks: 0,
      tags: [],
      options: [
        { optionText: "", isCorrect: false, order: 0 },
        { optionText: "", isCorrect: false, order: 1 },
        { optionText: "", isCorrect: false, order: 2 },
        { optionText: "", isCorrect: false, order: 3 },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  // Watch form data for real-time validation engine
  // eslint-disable-next-line react-hooks/incompatible-library
  const formData = watch();
  const healthResult = useMemo(() => calculateQuestionHealth(formData as any), [formData]);

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setValue(
        "tags",
        currentTags.filter((t: string) => t !== tag),
        { shouldValidate: true, shouldDirty: true }
      );
    } else {
      if (currentTags.length < 20) {
        setValue("tags", [...currentTags, tag], { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const setCorrectOption = (index: number) => {
    const currentOptions = formData.options || [];
    const newOptions = currentOptions.map((opt: any, i: number) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setValue("options", newOptions, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: any) => {
    if (healthResult.score < 75 || healthResult.blockingErrors.length > 0) {
      setError(
        "Cannot publish. Please resolve blocking errors and ensure the score is at least 75."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createQuestion({
        ...data,
        healthScore: healthResult.score,
        healthGrade: healthResult.grade,
        healthStatus: healthResult.status,
      });

      if (result.success) {
        router.push("/dashboard/admin/question-bank");
        router.refresh();
      } else {
        setError(result.error || "Failed to create question");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveDraft = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Allow draft save bypassing some Zod requirements if needed
      const result = await createQuestion({
        ...formData,
        healthScore: healthResult.score,
        healthGrade: healthResult.grade,
        healthStatus: healthResult.status,
      });

      if (result.success) {
        router.push("/dashboard/admin/question-bank");
        router.refresh();
      } else {
        setError(result.error || "Failed to save draft");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex gap-6 max-w-7xl mx-auto items-start">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-1 min-w-0">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Section: Classification */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
              Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category")}
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${errors.category ? "border-red-300" : "border-gray-300"}`}
                >
                  <option value="">Select category</option>
                  {QUESTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-500">{(errors.category as any).message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("subject")}
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${errors.subject ? "border-red-300" : "border-gray-300"}`}
                >
                  <option value="">Select subject</option>
                  {COMMON_SUBJECTS.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-500">{(errors.subject as any).message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
                <input
                  type="text"
                  {...register("topic")}
                  placeholder="e.g., Compound Interest"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setValue("difficulty", key as any, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`flex-1 px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                        formData.difficulty === key
                          ? "shadow-sm"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                      style={
                        formData.difficulty === key
                          ? {
                              borderColor: config.color,
                              backgroundColor: config.bgColor,
                              color: config.color,
                            }
                          : undefined
                      }
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Question Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
              Question Content
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("question")}
                  rows={4}
                  placeholder="Enter the question text…"
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${errors.question ? "border-red-300 focus:ring-red-500" : "border-gray-300"}`}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-red-500">{(errors.question as any)?.message}</span>
                  <p className="text-[11px] text-gray-400">
                    {(formData.question || "").length}/2000
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("explanation")}
                  rows={3}
                  placeholder="Provide a detailed explanation for the correct answer…"
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${errors.explanation ? "border-red-300 focus:ring-red-500" : "border-gray-300"}`}
                />
                {errors.explanation && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {(errors.explanation as any)?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Answer Options
              </h3>
              <span className="text-xs text-gray-400">Select the correct answer</span>
            </div>

            <div className="space-y-3">
              {fields.map((opt, index) => {
                const optErr =
                  errors.options && (errors.options as any)[index]?.optionText?.message;
                const isCorrect = formData.options?.[index]?.isCorrect;
                return (
                  <div key={opt.id} className="space-y-1">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        isCorrect
                          ? "border-emerald-300 bg-emerald-50/50"
                          : optErr
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
                        className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${optErr ? "border-red-300" : "border-gray-200"}`}
                      />

                      {fields.length > 4 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {optErr && <p className="text-xs text-red-500 ml-16">{optErr}</p>}
                  </div>
                );
              })}
            </div>

            {fields.length < 6 && (
              <button
                type="button"
                onClick={() => append({ optionText: "", isCorrect: false, order: fields.length })}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-secondary/80 font-medium transition-colors rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || healthResult.score < 75 || healthResult.blockingErrors.length > 0
              }
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Publish Question
            </button>
          </div>
        </form>

        {/* Right Side Sticky Panel */}
        <div className="w-80 shrink-0 sticky top-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-auto flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Question Health</h3>
            </div>

            <div className="p-5">
              {/* Overall Score */}
              <div
                className={`p-4 rounded-xl border mb-6 flex flex-col items-center justify-center text-center transition-colors ${
                  healthResult.status === "EXCELLENT"
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                    : healthResult.status === "GOOD"
                      ? "text-blue-600 bg-blue-50 border-blue-200"
                      : healthResult.status === "NEEDS_IMPROVEMENT"
                        ? "text-amber-600 bg-amber-50 border-amber-200"
                        : "text-red-600 bg-red-50 border-red-200"
                }`}
              >
                <span className="text-3xl font-black mb-1">
                  {healthResult.score}{" "}
                  <span className="text-lg text-current/60 font-medium">/ 100</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {healthResult.grade} &bull;{" "}
                  {healthResult.status === "EXCELLENT"
                    ? "Excellent"
                    : healthResult.status === "GOOD"
                      ? "Good"
                      : healthResult.status === "NEEDS_IMPROVEMENT"
                        ? "Needs Improvement"
                        : "Poor"}
                </span>
                {healthResult.score >= 75 && healthResult.blockingErrors.length === 0 ? (
                  <span className="text-xs mt-2 font-semibold bg-white/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready For Publish
                  </span>
                ) : (
                  <span className="text-xs mt-2 font-semibold bg-white/50 px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80">
                    Cannot Publish
                  </span>
                )}
              </div>

              {/* Breakdown Checklist */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${healthResult.breakdown.structure === 25 ? "text-emerald-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        healthResult.breakdown.structure === 25
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Structure Quality
                    </span>
                  </div>
                  <span className="font-semibold text-gray-400">
                    {healthResult.breakdown.structure}/25
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${healthResult.breakdown.metadata === 20 ? "text-emerald-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        healthResult.breakdown.metadata === 20
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Metadata Quality
                    </span>
                  </div>
                  <span className="font-semibold text-gray-400">
                    {healthResult.breakdown.metadata}/20
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${healthResult.breakdown.explanation === 20 ? "text-emerald-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        healthResult.breakdown.explanation === 20
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Explanation Quality
                    </span>
                  </div>
                  <span className="font-semibold text-gray-400">
                    {healthResult.breakdown.explanation}/20
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${healthResult.breakdown.answerIntegrity === 15 ? "text-emerald-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        healthResult.breakdown.answerIntegrity === 15
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Answer Integrity
                    </span>
                  </div>
                  <span className="font-semibold text-gray-400">
                    {healthResult.breakdown.answerIntegrity}/15
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${healthResult.breakdown.duplicates === 10 ? "text-emerald-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        healthResult.breakdown.duplicates === 10
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Duplicate Check
                    </span>
                  </div>
                  <span className="font-semibold text-gray-400">
                    {healthResult.breakdown.duplicates}/10
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${healthResult.breakdown.completeness === 10 ? "text-emerald-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        healthResult.breakdown.completeness === 10
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Content Completeness
                    </span>
                  </div>
                  <span className="font-semibold text-gray-400">
                    {healthResult.breakdown.completeness}/10
                  </span>
                </div>
              </div>

              {/* Errors & Suggestions */}
              {(healthResult.blockingErrors.length > 0 ||
                healthResult.improvementSuggestions.length > 0) && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  {healthResult.blockingErrors.length > 0 && (
                    <div>
                      <div className="flex items-start gap-1.5 text-red-600 mb-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Blocking Errors
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {healthResult.blockingErrors.map((err, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-red-700 bg-red-50/50 px-2.5 py-1.5 rounded border border-red-100 flex items-start gap-2"
                          >
                            <span className="text-red-400 mt-0.5">•</span>
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {healthResult.improvementSuggestions.length > 0 && (
                    <div>
                      <div className="flex items-start gap-1.5 text-amber-600 mb-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Improvement Suggestions
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {healthResult.improvementSuggestions.map((err, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-amber-700 bg-amber-50/50 px-2.5 py-1.5 rounded border border-amber-100 flex items-start gap-2"
                          >
                            <span className="text-amber-400 mt-0.5">•</span>
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
