import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { WizardState, WizardStep, SavingState } from "../types/wizard.types";

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      sessionId: `wizard-${Date.now()}`,
      sessionVersion: 1,
      currentStep: 1,
      draftData: {
        basics: {},
        config: {
          negativeMarkingEnabled: false,
          negativeMarkPerQuestion: 0,
          randomizeQuestions: false,
          randomizeOptions: false,
          attemptLimit: 1,
          reviewAllowed: true,
          bookmarkAllowed: true,
          sectionNavigation: "FREE",
          calculatorAllowed: false,
        },
        participation: {
          allowRetake: false,
        },
        composer: {
          sections: [],
        },
        certificates: {
          enableCertificates: false,
        },
      },
      savingState: "idle",
      lastSavedAt: null,

      setStep: (step: WizardStep) => set({ currentStep: step }),

      updateBasics: (data) =>
        set((state) => ({
          draftData: {
            ...state.draftData,
            basics: { ...state.draftData.basics, ...data },
          },
          sessionVersion: state.sessionVersion + 1,
        })),

      updateConfig: (data) =>
        set((state) => ({
          draftData: {
            ...state.draftData,
            config: { ...state.draftData.config, ...data },
          },
          sessionVersion: state.sessionVersion + 1,
        })),

      updateParticipation: (data) =>
        set((state) => ({
          draftData: {
            ...state.draftData,
            participation: { ...state.draftData.participation, ...data },
          },
          sessionVersion: state.sessionVersion + 1,
        })),

      updateComposer: (data) =>
        set((state) => ({
          draftData: {
            ...state.draftData,
            composer: { ...state.draftData.composer, ...data },
          },
          sessionVersion: state.sessionVersion + 1,
        })),

      updateCertificates: (data) =>
        set((state) => ({
          draftData: {
            ...state.draftData,
            certificates: { ...state.draftData.certificates, ...data },
          },
          sessionVersion: state.sessionVersion + 1,
        })),

      setSavingState: (savingState: SavingState) =>
        set((state) => ({
          savingState,
          lastSavedAt: savingState === "saved" ? Date.now() : state.lastSavedAt,
        })),

      incrementVersion: () => set((state) => ({ sessionVersion: state.sessionVersion + 1 })),

      resetWizard: () =>
        set({
          sessionId: `wizard-${Date.now()}`,
          sessionVersion: 1,
          currentStep: 1,
          draftData: {
            basics: {},
            config: {
              negativeMarkingEnabled: false,
              negativeMarkPerQuestion: 0,
              randomizeQuestions: false,
              randomizeOptions: false,
              attemptLimit: 1,
              reviewAllowed: true,
              bookmarkAllowed: true,
              sectionNavigation: "FREE",
              calculatorAllowed: false,
            },
            participation: { allowRetake: false },
            composer: { sections: [] },
            certificates: { enableCertificates: false },
          },
          savingState: "idle",
          lastSavedAt: null,
        }),
    }),
    {
      name: "competition-wizard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionVersion: state.sessionVersion,
        currentStep: state.currentStep,
        draftData: state.draftData,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
