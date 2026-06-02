"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuestionAuthoringStore } from "@/features/admin/store/question-authoring";
import { autosaveQuestionDraft } from "@/features/admin/services/question-bank";
import { MetadataStep } from "./steps/MetadataStep";
import { ContentStep } from "./steps/ContentStep";
import { PreviewStep } from "./steps/PreviewStep";
import { LiveValidationSidebar } from "./LiveValidationSidebar";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QuestionAuthoringWizard({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    formData,
    setFormData,
    syncStatus,
    setSyncStatus,
    lastSavedAt,
    setLastSavedAt,
    validationErrors,
    setValidationErrors,
    resetForm,
  } = useQuestionAuthoringStore();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    return () => {
      resetForm();
    };
  }, [initialData, setFormData, resetForm]);

  const triggerAutosave = useCallback(async () => {
    if (!formData.category) return; // Category is required for draft creation
    setSyncStatus("saving");
    try {
      const res = await autosaveQuestionDraft(formData);
      if (res.success) {
        if (!formData.id && res.questionId) {
          setFormData({ id: res.questionId });
          // Optionally update URL to include ID so refresh doesn't lose it
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
  }, [formData, setSyncStatus, setLastSavedAt, setFormData]);

  // Debounced autosave
  useEffect(() => {
    const handler = setTimeout(() => {
      // Don't autosave if empty
      if (formData.category) {
        triggerAutosave();
      }
    }, 2000);

    return () => clearTimeout(handler);
  }, [formData, triggerAutosave]);

  return (
    <div className="flex gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {formData.id ? "Edit Question" : "Create Question"}
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
              onClick={() => {}} // Submission logic handles inside PreviewStep
              disabled={validationErrors.length > 0}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Submit Question
            </button>
          )}
        </div>
      </div>

      {/* Validation Sidebar */}
      <div className="w-80 shrink-0">
        <LiveValidationSidebar />
      </div>
    </div>
  );
}
