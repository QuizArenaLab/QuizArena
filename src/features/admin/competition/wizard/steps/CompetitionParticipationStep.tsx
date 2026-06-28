"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "../context/useWizardStore";
import { competitionParticipationSchema } from "../validators/wizard.validators";
import { CompetitionParticipationData } from "../types/wizard.types";

interface Props {
  onValidationChange: (isValid: boolean) => void;
}

export function CompetitionParticipationStep({ onValidationChange }: Props) {
  const { draftData, updateParticipation, setStep, incrementVersion } = useWizardStore();

  const form = useForm<CompetitionParticipationData>({
    resolver: zodResolver(competitionParticipationSchema),
    defaultValues: {
      visibility: draftData.participation.visibility || "PUBLIC",
      startsAt: draftData.participation.startsAt || "",
      endsAt: draftData.participation.endsAt || "",
      maxParticipants: draftData.participation.maxParticipants || null,
      allowRetake: draftData.participation.allowRetake || false,
    },
    mode: "onChange",
  });

  const {
    formState: { isValid, errors },
    watch,
    register,
  } = form;
  const watchAll = watch();

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParticipation(watchAll);
    }, 1000);
    return () => clearTimeout(timer);
  }, [JSON.stringify(watchAll), updateParticipation]);

  const handleNext = () => {
    if (isValid) {
      incrementVersion();
      setStep(4);
    }
  };

  const handleBack = () => {
    incrementVersion();
    setStep(2);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy">Participation & Economics</h2>
        <p className="text-gray-500 text-sm mt-1">
          Configure who can participate, scheduling, and entry fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Visibility</label>
          <select
            {...register("visibility")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="INVITE_ONLY">Invite Only</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Max Participants (Optional)</label>
          <input
            type="number"
            {...register("maxParticipants", { valueAsNumber: true })}
            placeholder="Unlimited if left empty"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
          {errors.maxParticipants && (
            <p className="text-xs text-red-500">{errors.maxParticipants.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Starts At (Optional)</label>
          <input
            type="datetime-local"
            {...register("startsAt")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
          {errors.startsAt && <p className="text-xs text-red-500">{errors.startsAt.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Ends At (Optional)</label>
          <input
            type="datetime-local"
            {...register("endsAt")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
          {errors.endsAt && <p className="text-xs text-red-500">{errors.endsAt.message}</p>}
        </div>





        <div className="md:col-span-2">
          <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-orange-200 transition-colors">
            <div className="flex-1 pr-4">
              <h4 className="text-sm font-bold text-navy">Allow Retakes</h4>
              <p className="text-xs text-gray-500 mt-1">
                Can participants attempt the competition multiple times?
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input type="checkbox" className="sr-only peer" {...register("allowRetake")} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          onClick={handleBack}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 px-8 rounded-xl transition-all shadow-sm"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm"
        >
          Next Step: Review
        </button>
      </div>
    </div>
  );
}
