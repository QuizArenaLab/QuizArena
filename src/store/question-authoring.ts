import { create } from "zustand";
import { DraftQuestionInput } from "@/lib/validations/question";

export type AuthoringStep = "metadata" | "content" | "preview";
export type SyncStatus = "idle" | "saving" | "saved" | "error";

interface QuestionAuthoringState {
  // Navigation
  currentStep: AuthoringStep;
  setStep: (step: AuthoringStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Form Data
  formData: DraftQuestionInput;
  setFormData: (data: Partial<DraftQuestionInput>) => void;
  updateOption: (index: number, field: string, value: any) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
  resetForm: () => void;

  // Sync State
  syncStatus: SyncStatus;
  setSyncStatus: (status: SyncStatus) => void;
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date) => void;

  // Validation
  validationErrors: string[];
  setValidationErrors: (errors: string[]) => void;
}

const initialFormData: DraftQuestionInput = {
  question: "",
  explanation: "",
  category: "",
  subject: "",
  topic: "",
  difficulty: "MEDIUM",
  language: "en",
  marks: 1,
  negativeMarks: 0,
  tags: [],
  options: [
    { optionText: "", isCorrect: false, order: 0 },
    { optionText: "", isCorrect: false, order: 1 },
    { optionText: "", isCorrect: false, order: 2 },
    { optionText: "", isCorrect: false, order: 3 },
  ],
};

export const useQuestionAuthoringStore = create<QuestionAuthoringState>((set) => ({
  currentStep: "metadata",
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => {
      if (state.currentStep === "metadata") return { currentStep: "content" };
      if (state.currentStep === "content") return { currentStep: "preview" };
      return state;
    }),
  prevStep: () =>
    set((state) => {
      if (state.currentStep === "preview") return { currentStep: "content" };
      if (state.currentStep === "content") return { currentStep: "metadata" };
      return state;
    }),

  formData: { ...initialFormData },
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

  updateOption: (index, field, value) =>
    set((state) => {
      const newOptions = [...(state.formData.options || [])];
      if (field === "isCorrect") {
        newOptions.forEach((opt, i) => {
          opt.isCorrect = i === index;
        });
      } else {
        newOptions[index] = { ...newOptions[index], [field]: value };
      }
      return { formData: { ...state.formData, options: newOptions } };
    }),

  addOption: () =>
    set((state) => {
      const currentOptions = state.formData.options || [];
      if (currentOptions.length >= 6) return state;
      return {
        formData: {
          ...state.formData,
          options: [
            ...currentOptions,
            { optionText: "", isCorrect: false, order: currentOptions.length },
          ],
        },
      };
    }),

  removeOption: (index) =>
    set((state) => {
      const currentOptions = state.formData.options || [];
      if (currentOptions.length <= 2) return state;
      const newOptions = currentOptions.filter((_, i) => i !== index);
      // Reorder
      newOptions.forEach((opt, i) => (opt.order = i));
      return { formData: { ...state.formData, options: newOptions } };
    }),

  resetForm: () =>
    set({
      formData: { ...initialFormData },
      currentStep: "metadata",
      syncStatus: "idle",
      lastSavedAt: null,
      validationErrors: [],
    }),

  syncStatus: "idle",
  setSyncStatus: (status) => set({ syncStatus: status }),

  lastSavedAt: null,
  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  validationErrors: [],
  setValidationErrors: (errors) => set({ validationErrors: errors }),
}));
