"use server";

import { requireUser } from "@/features/rbac/constants/authorization";
import { LeaderboardFacade } from "../facade/LeaderboardFacade";

export async function getLeaderboardAction(leaderboardKey: string, cursor?: string, limit?: number) {
  try {
    const user = await requireUser();
    
    // We pass user.id to always fetch their position even if they are rank 500,000
    const readModel = await LeaderboardFacade.getLeaderboard(
      leaderboardKey, 
      user?.id, // Optional, public viewers might not be logged in
      cursor, 
      limit
    );
    
    return { success: true, data: readModel };
  } catch (error: any) {
    console.error("[LeaderboardAction] Failed to load leaderboard:", error);
    return { success: false, error: error.message || "Failed to load leaderboard" };
  }
}
