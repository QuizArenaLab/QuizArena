import { prisma } from "@/lib/prisma";
import { UserRewardsReadModel } from "../read-model/RewardReadModel";
import { BadgeRegistry } from "../badges/registry/BadgeRegistry";

export class RewardsFacade {
  /**
   * Loads the complete reward read model for a user's dashboard.
   */
  public static async getUserRewards(userId: string): Promise<UserRewardsReadModel> {
    
    // 1. Fetch Certificates
    const certs = await prisma.certificateSnapshot.findMany({
      where: { userId },
      orderBy: { issueDate: "desc" }
    });

    // 2. Fetch Badges
    const badges = await prisma.badgeSnapshot.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" }
    });

    // 3. Fetch Ledger History (Limit to 50 for UI)
    const history = await prisma.rewardLedger.findMany({
      where: { recipientId: userId },
      orderBy: { issuedAt: "desc" },
      take: 50
    });

    return {
      certificates: certs.map(c => ({
        id: c.id,
        type: c.certificateType,
        competitionName: c.competitionName,
        issueDate: c.issueDate.toISOString(),
        pdfUrl: c.pdfUrl,
        verificationUrl: `/verify/certificate/${c.verificationToken}`
      })),
      badges: badges.map(b => ({
        id: b.id,
        type: b.badgeType,
        competitionId: b.competitionId,
        issuedAt: b.issuedAt.toISOString(),
        metadata: BadgeRegistry.getBadge(b.badgeType)
      })),
      history: history.map(h => ({
        id: h.id,
        event: h.rewardEvent,
        type: h.rewardType,
        status: h.status,
        date: h.issuedAt.toISOString(),
        reason: h.failureReason
      }))
    };
  }
}
