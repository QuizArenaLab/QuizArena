"use client";

import { useRuntimeState, useRuntimeCommand } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { rendererRegistry } from "./registry";

// Ensure all renderers are registered
import "./components/SingleChoiceRenderer";
import "./components/MultipleChoiceRenderer";
import "./components/TrueFalseRenderer";
import "./components/NumericRenderer";

export function QuestionRenderer() {
  const questions = useRuntimeState((s: any) => s.questions);
  const currentIndex = useRuntimeState((s: any) => s.currentIndex);
  const answers = useRuntimeState((s: any) => s.answers);
  const status = useRuntimeState((s: any) => s.status);

  const { dispatch } = useRuntimeCommand();

  const isSubmitting = status === "SUBMITTING" || status === "SUBMITTED";
  const question = questions[currentIndex];
  
  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Loading question...</p>
      </div>
    );
  }

  const selectedOptionId = answers[question.questionId] || null;

  const handleSelectOption = (optionId: string) => {
    if (isSubmitting) return;
    dispatch("SelectAnswer", { questionId: question.questionId, optionId });
  };

  const RendererComponent = rendererRegistry.get(question.type) || rendererRegistry.get("SINGLE_CHOICE");

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
      {/* Question Text */}
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed">
        {question.questionText}
      </h2>

      {/* Dynamic Answer Renderer */}
      {RendererComponent ? (
        <RendererComponent 
          question={question} 
          selectedOptionId={selectedOptionId} 
          onSelectOption={handleSelectOption} 
          isSubmitting={isSubmitting} 
        />
      ) : (
        <div className="text-red-400 p-4 bg-red-400/10 rounded-lg">
          No renderer registered for question type: {question.type}
        </div>
      )}
    </div>
  );
}
