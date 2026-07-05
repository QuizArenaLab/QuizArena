"use server";

import { CompetitionOperationsService } from "../services/CompetitionOperationsService";
import { CompetitionLifecycle } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const opsService = new CompetitionOperationsService();

export async function updateCompetitionLifecycleAction(slug: string, newState: CompetitionLifecycle, userId: string) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!competition) {
      return { success: false, error: "Competition not found." };
    }

    const updated = await opsService.updateLifecycleState(competition.id, newState, userId);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Failed to update lifecycle:", error);
    return { success: false, error: error.message };
  }
}
