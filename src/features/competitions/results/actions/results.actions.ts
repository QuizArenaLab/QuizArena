"use server";

import { requireUser } from "@/features/rbac/constants/authorization";
import { CompetitionResultsFacade } from "../facade/CompetitionResultsFacade";

export async function getResultReadModel(attemptId: string) {
  try {
    const user = await requireUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const readModel = await CompetitionResultsFacade.getResultReadModel(attemptId, user.id);
    return { success: true, data: readModel };
  } catch (error: any) {
    console.error("[ResultsAction] Failed to get result read model:", error);
    return { success: false, error: error.message || "Failed to load results" };
  }
}
