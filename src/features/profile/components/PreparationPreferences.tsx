"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Target, Save } from "lucide-react";
import type { User as PrismaUser, ExamCategory, PreparationLevel } from "@/generated/prisma";
import { notify } from '@/shared/feedback/notify';
import { updatePreferencesAction } from "@/features/user/services/account";

interface PreparationPreferencesProps {
  user: PrismaUser;
}

export function PreparationPreferences({ user }: PreparationPreferencesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [examCategory, setExamCategory] = useState<ExamCategory | "">(user.examCategory || "");
  const [preparationLevel, setPreparationLevel] = useState<PreparationLevel | "">(
    user.preparationLevel || ""
  );
  const [dailyPracticeGoal, setDailyPracticeGoal] = useState<number>(
    (user as any).dailyPracticeGoal || 20
  );
  const [recommendationEngine, setRecommendationEngine] = useState<boolean>(
    (user as any).recommendationEngine ?? true
  );
  const [pendingToast, setPendingToast] = useState<{
    id: string;
    title: string;
    desc?: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending && pendingToast) {
      notify.success(pendingToast.title, {
        id: pendingToast.id,
        description: pendingToast.desc,
      });
      setTimeout(() => setPendingToast(null), 0);
    }
  }, [isPending, pendingToast]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = notify.loading("Updating Preferences...");
    startTransition(async () => {
      try {
        const result = await updatePreferencesAction({
          examCategory: (examCategory as ExamCategory) || undefined,
          preparationLevel: (preparationLevel as PreparationLevel) || undefined,
          dailyPracticeGoal,
          recommendationEngine,
        });
        if (result.success) {
          router.refresh();
          setPendingToast({
            id: toastId,
            title: "Preferences Updated",
            desc: "Your preparation settings have been saved.",
          });
        } else {
          notify.error("Failed to update preferences", { id: toastId });
        }
      } catch (error) {
        notify.error("Failed to update preferences", { id: toastId });
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 text-gray-500">
        <BookOpen className="w-4 h-4 text-gray-400" />
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
          Preparation Preferences
        </h2>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex text-sm font-bold text-gray-700 items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              Target Examination
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "SSC", label: "SSC" },
                { value: "BANKING", label: "Banking" },
                { value: "RAILWAYS", label: "Railways" },
                { value: "STATE_PSC", label: "State PSC" },
              ].map((exam) => (
                <button
                  key={exam.value}
                  type="button"
                  onClick={() => setExamCategory(exam.value as ExamCategory)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                    examCategory === exam.value
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200"
                  }`}
                >
                  {exam.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex text-sm font-bold text-gray-700 items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              Difficulty Preference
            </label>
            <div className="flex flex-col gap-3">
              {[
                { value: "BEGINNER", label: "Beginner" },
                { value: "INTERMEDIATE", label: "Intermediate" },
                { value: "ADVANCED", label: "Advanced" },
              ].map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setPreparationLevel(level.value as PreparationLevel)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all text-left flex justify-between items-center ${
                    preparationLevel === level.value
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200"
                  }`}
                >
                  {level.label}
                  {preparationLevel === level.value && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <label className="flex text-sm font-bold text-gray-700 items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              Daily Practice Goal
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 50].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setDailyPracticeGoal(goal)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                    dailyPracticeGoal === goal
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200"
                  }`}
                >
                  {goal} Qs
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex text-sm font-bold text-gray-700 items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              Recommendation Engine
            </label>
            <div className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">Personalized Challenges</p>
                <p className="text-xs text-gray-500 mt-1">
                  {recommendationEngine
                    ? "Personalized challenge recommendations enabled"
                    : "Only standard challenge suggestions"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRecommendationEngine(!recommendationEngine)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 ease-in-out ${
                  recommendationEngine ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                    recommendationEngine ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-navy hover:border-gray-300 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Updating..." : "Update Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
