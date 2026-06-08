"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuestionAuthoringStore } from "@/features/admin/store/question-authoring";
import { autosaveQuestionDraft, createQuestion } from "@/features/admin/services/question-bank";
import { MetadataStep } from "./steps/MetadataStep";
import { ContentStep } from "./steps/ContentStep";
import { PreviewStep } from "./steps/PreviewStep";
import { LiveValidationSidebar } from "./LiveValidationSidebar";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateQuestionQuality } from "@/lib/validations/question-engine";
import { createQuestionSchema, CreateQuestionInput } from "@/lib/validations/question";

export function QuestionAuthoringWizard({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    syncStatus,
    setSyncStatus,
    lastSavedAt,
    setLastSavedAt,
    resetForm,
  } = useQuestionAuthoringStore();

  const methods = useForm<any>({
    resolver: zodResolver(createQuestionSchema) as any,
    mode: "onChange",
    defaultValues: initialData || {
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
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  // eslint-disable-next-line react-hooks/incompatible-library
  const formData = watch();
  const quality = useMemo(() => calculateQuestionQuality(formData as any), [formData]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const triggerAutosave = useCallback(async () => {
    if (!formData.category) return;
    setSyncStatus("saving");
    try {
      const res = await autosaveQuestionDraft(formData as any);
      if (res.success) {
        if (!initialData?.id && res.questionId) {
          methods.setValue("id" as any, res.questionId);
          window.history.replaceState(
            null,
            "",
            `/dashboard/admin/question-bank/${res.questionId}/edit`
          );
        }
        setSyncStatus("saved");
        setLastSavedAt(new Date());
      } else {
        setSyncStatus("error");
      }
    } catch {
      setSyncStatus("error");
    }
  }, [formData, setSyncStatus, setLastSavedAt, methods, initialData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.category) {
        triggerAutosave();
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [formData, triggerAutosave]);

  const onSubmit = async (data: any) => {
    if (quality.score < 75 || quality.blockingErrors.length > 0) return;

    try {
      const result = await createQuestion({
        ...data,
        qualityScore: quality.score,
        questionHealth: quality.health,
        validationStatus: "VALID",
      });

      if (result.success) {
        router.push("/dashboard/admin/question-bank");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {initialData?.id ? "Edit Question" : "Create Question"}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                {syncStatus === "saving" && (
                  <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                )}
                {syncStatus === "saved" && lastSavedAt && (
                  <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved at{" "}
                    {lastSavedAt.toLocaleTimeString()}
                  </span>
                )}
                {syncStatus === "error" && (
                  <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5" /> Autosave failed
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard/admin/question-bank")}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                Discard
              </button>
            </div>
          </div>

          {/* Steps Tracker */}
          <div className="flex items-center gap-2 mb-6">
            {(["metadata", "content", "preview"] as const).map((step, idx) => (
              <div
                key={step}
                onClick={() => setStep(step)}
                className={`flex-1 h-2 rounded-full cursor-pointer transition-colors ${
                  currentStep === step
                    ? "bg-indigo-600"
                    : idx < ["metadata", "content", "preview"].indexOf(currentStep)
                      ? "bg-indigo-200"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === "metadata" && <MetadataStep />}
                {currentStep === "content" && <ContentStep />}
                {currentStep === "preview" && <PreviewStep />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === "metadata"}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentStep !== "preview" ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm"
              >
                {" "}
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || quality.score < 75 || quality.blockingErrors.length > 0}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Publish Question
              </button>
            )}
          </div>
        </div>

        {/* Validation Sidebar */}
        <div className="w-80 shrink-0">
          <LiveValidationSidebar />
        </div>
      </div>
    </FormProvider>
  );
}
