"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "../context/useWizardStore";
import { createDraftCompetition } from "../actions/wizard.actions";
import { Loader2, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { createDraftWizardSchema } from "../validators/wizard.validators";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { checkCompetitionReadinessAction } from "@/competitions/actions/readiness.actions";
import { ReadinessReport } from "@/competitions/services/CompetitionReadinessService";

export function CompetitionReviewStep() {
  const { draftData, setStep, resetWizard } = useWizardStore();
  const [submitting, setSubmitting] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessReport | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load readiness report
    checkCompetitionReadinessAction(draftData).then((res) => {
      if (res.success && res.data) {
        setReadiness(res.data);
      }
    });
  }, [draftData]);

  const isValid = readiness?.isReady || false;

  const handleSubmit = async () => {
    if (!isValid) return;

    setSubmitting(true);
    try {
      const res = await createDraftCompetition(draftData);
      if (res.success && res.competitionId) {
        toast.success("Draft Competition Created Successfully!");
        resetWizard();
        router.push(`/admin/dashboard/competitions/${res.competitionId}`);
      } else {
        toast.error(res.error || "Failed to create competition.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-navy">Review & Create Draft</h2>
        <p className="text-gray-500 text-sm mt-1">
          Verify all details and fix any readiness errors before persisting this competition to the database.
        </p>
      </div>

      {!readiness ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
          <span className="text-gray-500 text-sm">Checking readiness...</span>
        </div>
      ) : (
        <>
          {readiness.errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <XCircle className="w-5 h-5" />
                Readiness Errors ({readiness.errors.length})
              </div>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                {readiness.errors.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          {readiness.warnings.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-yellow-700 font-bold mb-2">
                <AlertTriangle className="w-5 h-5" />
                Readiness Warnings ({readiness.warnings.length})
              </div>
              <ul className="list-disc list-inside text-sm text-yellow-600 space-y-1">
                {readiness.warnings.map((warn: string, i: number) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
          {readiness.isReady && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                All mandatory readiness checks passed.
              </div>
            </div>
          )}
        </>
      )}

      {/* Summary Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basics */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs flex items-center justify-between border-b pb-2">
            <span>Basics</span>
            <button onClick={() => setStep(1)} className="text-orange-500 hover:underline">
              Edit
            </button>
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Title</dt>
              <dd className="font-semibold text-right max-w-[200px] truncate">
                {draftData.basics.title || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Slug</dt>
              <dd className="font-semibold text-right max-w-[200px] truncate">
                {draftData.basics.slug || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Type</dt>
              <dd className="font-semibold text-right">
                {draftData.basics.competitionType || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Exam</dt>
              <dd className="font-semibold text-right">{draftData.basics.exam || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Difficulty</dt>
              <dd className="font-semibold text-right">{draftData.basics.difficulty || "—"}</dd>
            </div>
          </dl>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs flex items-center justify-between border-b pb-2">
            <span>Configuration</span>
            <button onClick={() => setStep(2)} className="text-orange-500 hover:underline">
              Edit
            </button>
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Duration</dt>
              <dd className="font-semibold text-right">{draftData.config.durationMinutes} mins</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Marks (Max / Pass)</dt>
              <dd className="font-semibold text-right">
                {draftData.config.maximumMarks} / {draftData.config.passingMarks}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Negative Marking</dt>
              <dd className="font-semibold text-right">
                {draftData.config.negativeMarkingEnabled
                  ? `Yes (${draftData.config.negativeMarkPerQuestion})`
                  : "No"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Randomize Questions</dt>
              <dd className="font-semibold text-right">
                {draftData.config.randomizeQuestions ? "Yes" : "No"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Randomize Options</dt>
              <dd className="font-semibold text-right">
                {draftData.config.randomizeOptions ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Participation */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs flex items-center justify-between border-b pb-2">
            <span>Participation</span>
            <button onClick={() => setStep(3)} className="text-orange-500 hover:underline">
              Edit
            </button>
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Visibility</dt>
              <dd className="font-semibold text-right">
                {draftData.participation.visibility || "—"}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-500">Starts At</dt>
              <dd className="font-semibold text-right">
                {draftData.participation.startsAt
                  ? new Date(draftData.participation.startsAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Ends At</dt>
              <dd className="font-semibold text-right">
                {draftData.participation.endsAt
                  ? new Date(draftData.participation.endsAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Readiness Checklist */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs border-b pb-2">
            Publishing Readiness
          </h3>
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-navy">Draft Status</p>
                <p className="text-xs text-gray-500">
                  This will be created as a Draft. Questions must be attached later before it can go
                  Live.
                </p>
              </div>
            </div>
            {!draftData.participation.startsAt && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-navy">No Schedule</p>
                  <p className="text-xs text-gray-500">
                    You haven&apos;t set a start date. You will need to start it manually.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
        <button
          onClick={() => setStep(3)}
          disabled={submitting}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 px-8 rounded-xl transition-all shadow-sm"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Draft"}
          {!submitting && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
