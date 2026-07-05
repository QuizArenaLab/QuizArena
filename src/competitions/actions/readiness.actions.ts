"use server";

import { CompetitionReadinessService } from "../services/CompetitionReadinessService";
import { WizardDraftData } from "@/features/admin/competition/wizard/types/wizard.types";

const readinessService = new CompetitionReadinessService();

export async function checkCompetitionReadinessAction(draftData: WizardDraftData) {
  try {
    const report = readinessService.validateDraft(draftData);
    return { success: true, data: report };
  } catch (error: any) {
    console.error("Failed to check readiness:", error);
    return { success: false, error: error.message };
  }
}
