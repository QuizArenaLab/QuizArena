import { create } from "zustand";
import { PublishingConfig, PublishingLockInfo } from "../publishing/types/publishing.types";
import { ValidationReport, ReadinessScore } from "../validation/types/validation.types";

interface PublishingState {
  activeTab: "overview" | "preview" | "history";
  setActiveTab: (tab: "overview" | "preview" | "history") => void;

  config: PublishingConfig;
  setConfig: (config: Partial<PublishingConfig>) => void;

  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void;

  publishingLock: PublishingLockInfo | null;
  setPublishingLock: (lock: PublishingLockInfo | null) => void;
}

export const usePublishingStore = create<PublishingState>((set) => ({
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),

  config: {
    mode: "IMMEDIATE",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    changelog: "",
  },
  setConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),

  isSubmitting: false,
  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  publishingLock: null,
  setPublishingLock: (publishingLock) => set({ publishingLock }),
}));
