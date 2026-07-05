import {
  CompetitionType,
  ExamCategory,
  ChallengeDifficulty,
  CompetitionVisibility,
} from "@/generated/prisma";
import { z } from "zod";
import {
  competitionBasicsSchema,
  competitionConfigSchema,
  competitionParticipationSchema,
  competitionComposerSchema,
  competitionCertificatesSchema,
} from "../validators/wizard.validators";

export type CompetitionBasicsData = z.infer<typeof competitionBasicsSchema>;
export type CompetitionConfigData = z.infer<typeof competitionConfigSchema>;
export type CompetitionParticipationData = z.infer<typeof competitionParticipationSchema>;
export type CompetitionComposerData = z.infer<typeof competitionComposerSchema>;
export type CompetitionCertificatesData = z.infer<typeof competitionCertificatesSchema>;

export interface WizardDraftData {
  basics: Partial<CompetitionBasicsData>;
  config: Partial<CompetitionConfigData>;
  participation: Partial<CompetitionParticipationData>;
  composer: Partial<CompetitionComposerData>;
  certificates: Partial<CompetitionCertificatesData>;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SavingState = "idle" | "saving" | "saved" | "error";

export interface WizardState {
  sessionId: string;
  sessionVersion: number;
  currentStep: WizardStep;
  draftData: WizardDraftData;
  savingState: SavingState;
  lastSavedAt: number | null;

  // Actions
  setStep: (step: WizardStep) => void;
  updateBasics: (data: Partial<CompetitionBasicsData>) => void;
  updateConfig: (data: Partial<CompetitionConfigData>) => void;
  updateParticipation: (data: Partial<CompetitionParticipationData>) => void;
  updateComposer: (data: Partial<CompetitionComposerData>) => void;
  updateCertificates: (data: Partial<CompetitionCertificatesData>) => void;
  setSavingState: (state: SavingState) => void;
  incrementVersion: () => void;
  resetWizard: () => void;
}
