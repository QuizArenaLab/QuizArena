"use server";

import { CompetitionFreezeService } from "../services/CompetitionFreezeService";
import { prisma } from "@/lib/prisma";

const freezeService = new CompetitionFreezeService();

export async function freezeCompetitionAction(slug: string, userId: string) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { slug },
      select: { id: true },
    });
    
    if (!competition) {
      return { success: false, error: "Competition not found by slug." };
    }

    const frozen = await freezeService.freezeCompetition(competition.id, userId);
    return { success: true, data: frozen };
  } catch (error: any) {
    console.error("Failed to freeze competition:", error);
    return { success: false, error: error.message };
  }
}
