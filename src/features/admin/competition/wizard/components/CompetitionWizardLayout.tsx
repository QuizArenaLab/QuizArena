"use client";

import { useEffect, useState } from "react";
import { WizardProgress } from "./WizardProgress";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";
import { useWizardStore } from "../context/useWizardStore";
import { WizardStep } from "../types/wizard.types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Note: verify if we have a button component, else use standard classes. I'll use standard classes to be safe.

export function CompetitionWizardLayout({ children }: { children: React.ReactNode }) {
  const { currentStep, resetWizard } = useWizardStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration mismatch from Zustand persist
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-orange-500" />
      </div>
    );
  }

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to exit? Your draft progress will be saved in your browser until you clear it."
      )
    ) {
      router.push("/admin/dashboard/competitions");
    }
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to discard this draft? All data will be lost permanently.")
    ) {
      resetWizard();
      router.push("/admin/dashboard/competitions");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnsavedChangesDialog />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-navy hidden md:block">Create Competition</h1>
            <AutoSaveIndicator />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
            >
              Discard Draft
            </button>
            <button
              onClick={handleCancel}
              className="text-sm font-semibold text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        {/* We pass validSteps down to progress via children context or we let steps validate internally */}
        {/* Since the components are managing validation locally before allowing 'Next', the Progress indicator just needs to know what step we're on. */}
        {children}
      </main>
    </div>
  );
}
