"use client";

import { useState } from "react";
import { useWizardStore } from "../context/useWizardStore";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { freezeCompetitionAction } from "@/competitions/actions/freeze.actions";

export function CompetitionFreezeStep() {
  const { currentStep, setStep, draftData, sessionId } = useWizardStore();
  const [isFreezing, setIsFreezing] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const handleFreeze = async () => {
    const slug = draftData.basics.slug || `draft-${sessionId}`;
    setIsFreezing(true);
    
    try {
      // Mocking userId as "admin" for now, or you'd get it from a hook like useSession
      const res = await freezeCompetitionAction(slug, "admin");
      if (res.success) {
        toast.success("Competition snapshot frozen successfully!");
        setIsFrozen(true);
      } else {
        toast.error(res.error || "Failed to freeze competition.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during freeze.");
    } finally {
      setIsFreezing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Lock className="w-6 h-6 text-blue-600" />
          Freeze Version
        </h2>
        <p className="text-gray-500 mt-2">
          Freeze this competition version to create an immutable snapshot before publishing.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <h3 className="font-bold text-navy mb-1">What happens when you freeze?</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>The current structural schema (Sections & Questions) is locked.</li>
              <li>Scoring mechanisms and time limits are finalized.</li>
              <li>The draft is securely hashed and prepared for Candidate instantiation.</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleFreeze}
            disabled={isFreezing || isFrozen}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
          >
            {isFreezing && <Loader2 className="w-4 h-4 animate-spin" />}
            {isFrozen ? "Frozen Successfully" : "Freeze Snapshot"}
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setStep(6)}
          className="px-6 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(8)}
          disabled={!isFrozen}
          className="px-6 py-2 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next: Publish
        </button>
      </div>
    </div>
  );
}
