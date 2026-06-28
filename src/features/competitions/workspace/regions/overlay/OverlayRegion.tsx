"use client";

import { useRuntimeState, useRuntimeCommand } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function OverlayRegion() {
  const status = useRuntimeState((s: any) => s.status);
  const { dispatch } = useRuntimeCommand();

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // We can listen to a custom event or state for showing the modal, 
  // but usually a global state manager or context handles overlay toggles.
  // For MVP, we expose a global window method to trigger it from TopRegion,
  // or we can just move the submit button logic here. Let's provide a global trigger.

  // Actually, a better React way is to use an event emitter or zustand store. 
  // Since we want to keep it simple, we'll expose a window event.
  if (typeof window !== "undefined") {
    (window as any).triggerSubmitModal = () => setShowSubmitConfirm(true);
  }

  const isSubmitting = status === "SUBMITTING";

  if (!showSubmitConfirm && status !== "SUBMITTING") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Submitting...</h3>
            <p className="text-slate-400 text-sm text-center">Please wait while we secure your answers.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white mb-3">Submit Assessment?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Are you sure you want to submit your answers? You cannot change them after submission.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  dispatch("SubmitCompetition");
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold transition-colors shadow-lg shadow-blue-900/20"
              >
                Confirm Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
