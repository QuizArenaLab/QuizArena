"use client";

import { useWizardStore } from "@/features/admin/competition/wizard/context/useWizardStore";
import { CompetitionWizardLayout } from "@/features/admin/competition/wizard/components/CompetitionWizardLayout";
import { WizardProgress } from "@/features/admin/competition/wizard/components/WizardProgress";
import { useState } from "react";
import { WizardStep } from "@/features/admin/competition/wizard/types/wizard.types";
import dynamic from "next/dynamic";

type StepProps = { onValidationChange: (isValid: boolean) => void };

const CompetitionBasicsStep = dynamic<StepProps>(
  () =>
    import("@/features/admin/competition/wizard/steps/CompetitionBasicsStep").then(
      (mod) => mod.CompetitionBasicsStep
    ),
  { ssr: false }
);
const CompetitionConfigurationStep = dynamic<StepProps>(
  () =>
    import("@/features/admin/competition/wizard/steps/CompetitionConfigurationStep").then(
      (mod) => mod.CompetitionConfigurationStep
    ),
  { ssr: false }
);
const CompetitionParticipationStep = dynamic<StepProps>(
  () =>
    import("@/features/admin/competition/wizard/steps/CompetitionParticipationStep").then(
      (mod) => mod.CompetitionParticipationStep
    ),
  { ssr: false }
);
const CompetitionReviewStep = dynamic(
  () =>
    import("@/features/admin/competition/wizard/steps/CompetitionReviewStep").then(
      (mod) => mod.CompetitionReviewStep
    ),
  { ssr: false }
);

export default function CompetitionWizardPage() {
  const { currentStep } = useWizardStore();

  const [validSteps, setValidSteps] = useState<Record<WizardStep, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const handleStepValidation = (step: WizardStep, isValid: boolean) => {
    setValidSteps((prev) => ({ ...prev, [step]: isValid }));
  };

  return (
    <CompetitionWizardLayout>
      <WizardProgress validSteps={validSteps} />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10">
        {currentStep === 1 && (
          <CompetitionBasicsStep onValidationChange={(v: boolean) => handleStepValidation(1, v)} />
        )}
        {currentStep === 2 && (
          <CompetitionConfigurationStep
            onValidationChange={(v: boolean) => handleStepValidation(2, v)}
          />
        )}
        {currentStep === 3 && (
          <CompetitionParticipationStep
            onValidationChange={(v: boolean) => handleStepValidation(3, v)}
          />
        )}
        {currentStep === 4 && <CompetitionReviewStep />}
      </div>
    </CompetitionWizardLayout>
  );
}
