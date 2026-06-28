"use server";

import { requireUser } from "@/features/rbac/constants/authorization";
import { RewardsFacade } from "../facade/RewardsFacade";
import { VerificationService } from "../certificates/verification/VerificationService";

export async function getUserRewardsAction() {
  try {
    const user = await requireUser();
    const data = await RewardsFacade.getUserRewards(user.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("[RewardsAction] Failed to load rewards:", error);
    return { success: false, error: error.message };
  }
}

export async function verifyCertificateAction(token: string) {
  try {
    const data = await VerificationService.verifyToken(token);
    if (!data) return { success: false, error: "Certificate not found or invalid" };
    return { success: true, data };
  } catch (error: any) {
    console.error("[VerificationAction] Failed to verify:", error);
    return { success: false, error: "Verification system error" };
  }
}
