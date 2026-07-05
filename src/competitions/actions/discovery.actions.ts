"use server";

import { discoveryService } from "../services/CompetitionDiscoveryService";
import { CompetitionLifecycle } from "@/generated/prisma";

export async function fetchDiscoverableCompetitionsAction(filters?: {
  category?: string;
  difficulty?: string;
  status?: CompetitionLifecycle;
  cursor?: string;
  limit?: number;
}) {
  try {
    const competitions = await discoveryService.getDiscoverableCompetitions(filters);
    return { success: true as const, data: competitions };
  } catch (error) {
    console.error("Failed to fetch discoverable competitions:", error);
    return { success: false as const, error: "Failed to load competitions" };
  }
}
