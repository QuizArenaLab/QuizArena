"use server";

import { prisma } from "@/lib/prisma";
import { ActivityType, AchievementType, InviteStatus, ParticipationType } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { getPerformanceOverview } from '@/features/analytics/services/performance';

// ============================================================================
// TYPES
// ============================================================================

export interface CompetitiveProfile {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  categoryFocus: string | null;
  totalAttempts: number;
  completedAttempts: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  highestRank: number | null;
  achievements: { type: string; unlockedAt: Date }[];
}

export interface PeerComparison {
  user1: {
    id: string;
    name: string;
    averageAccuracy: number;
    highestRank: number | null;
    completedAttempts: number;
    currentStreak: number;
  };
  user2: {
    id: string;
    name: string;
    averageAccuracy: number;
    highestRank: number | null;
    completedAttempts: number;
    currentStreak: number;
  };
}

export interface EngagementFeedItem {
  id: string;
  type: ActivityType;
  content: string;
  createdAt: Date;
}

// ============================================================================
// PROFILE & PEER COMPARISON
// ============================================================================

export async function getCompetitiveProfile(userId: string): Promise<CompetitiveProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      examCategory: true,
      achievements: {
        select: { type: true, unlockedAt: true },
        orderBy: { unlockedAt: "desc" },
      },
    },
  });

  if (!user) return null;

  const performance = await getPerformanceOverview(userId);

  return {
    id: user.id,
    name: user.name || "Aspirant",
    username: user.username,
    image: user.image,
    categoryFocus: user.examCategory,
    totalAttempts: performance.totalAttempts,
    completedAttempts: performance.completedAttempts,
    averageAccuracy: performance.averageAccuracy,
    currentStreak: performance.currentStreak,
    longestStreak: performance.longestStreak,
    highestRank: performance.rank,
    achievements: user.achievements,
  };
}

export async function getPeerComparison(
  user1Id: string,
  user2Id: string
): Promise<PeerComparison | null> {
  const [profile1, profile2] = await Promise.all([
    getCompetitiveProfile(user1Id),
    getCompetitiveProfile(user2Id),
  ]);

  if (!profile1 || !profile2) return null;

  return {
    user1: {
      id: profile1.id,
      name: profile1.name,
      averageAccuracy: profile1.averageAccuracy,
      highestRank: profile1.highestRank,
      completedAttempts: profile1.completedAttempts,
      currentStreak: profile1.currentStreak,
    },
    user2: {
      id: profile2.id,
      name: profile2.name,
      averageAccuracy: profile2.averageAccuracy,
      highestRank: profile2.highestRank,
      completedAttempts: profile2.completedAttempts,
      currentStreak: profile2.currentStreak,
    },
  };
}

// ============================================================================
// COMPETITIVE FEED & MILESTONES
// ============================================================================

export async function getCompetitiveFeed(
  userId: string,
  limit: number = 10
): Promise<EngagementFeedItem[]> {
  const activities = await prisma.competitiveActivity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return activities.map((act) => ({
    id: act.id,
    type: act.type,
    content: act.content,
    createdAt: act.createdAt,
  }));
}

export async function logCompetitiveActivity(userId: string, type: ActivityType, content: string) {
  try {
    await prisma.competitiveActivity.create({
      data: { userId, type, content },
    });
    revalidatePath("/dashboard/home");
  } catch (error) {
    console.error("Failed to log competitive activity:", error);
  }
}

export async function awardMilestone(userId: string, type: AchievementType, content: string) {
  try {
    // Idempotent: avoid duplicate awards
    const existing = await prisma.userAchievement.findUnique({
      where: { userId_type: { userId, type } },
    });

    if (!existing) {
      await prisma.userAchievement.create({
        data: { userId, type },
      });
      await logCompetitiveActivity(userId, ActivityType.MILESTONE, content);
    }
  } catch (error) {
    console.error("Failed to award milestone:", error);
  }
}

// ============================================================================
// INVITE SYSTEM
// ============================================================================

export async function createChallengeInvite(challengeId: string, email: string) {
  // Check if challenge is INVITE_ONLY
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { participationType: true },
  });

  if (!challenge || challenge.participationType !== ParticipationType.INVITE_ONLY) {
    return { success: false, error: "Challenge is not invite-only or does not exist." };
  }

  // Idempotent invite creation
  const existing = await prisma.challengeInvite.findUnique({
    where: { challengeId_email: { challengeId, email } },
  });

  if (existing) {
    return { success: true, inviteCode: existing.inviteCode };
  }

  // 7 days expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invite = await prisma.challengeInvite.create({
    data: {
      challengeId,
      email,
      expiresAt,
    },
  });

  return { success: true, inviteCode: invite.inviteCode };
}

export async function validateInvite(inviteCode: string, userId: string) {
  const invite = await prisma.challengeInvite.findUnique({
    where: { inviteCode },
    include: { challenge: true },
  });

  if (!invite) {
    return { success: false, error: "Invalid invite code." };
  }

  if (invite.status === InviteStatus.ACCEPTED) {
    return { success: false, error: "Invite has already been accepted." };
  }

  if (
    invite.status === InviteStatus.EXPIRED ||
    (invite.expiresAt && invite.expiresAt < new Date())
  ) {
    return { success: false, error: "Invite has expired." };
  }

  // We could strictly enforce email match if we had the user's email, but for competitive flexibility
  // if they hold the invite code and they are authenticated, we bind it to them.
  await prisma.challengeInvite.update({
    where: { id: invite.id },
    data: {
      status: InviteStatus.ACCEPTED,
      invitedUserId: userId,
      acceptedAt: new Date(),
    },
  });

  // Log social activity
  await logCompetitiveActivity(
    userId,
    ActivityType.INVITE_ACCEPTED,
    `Joined challenge: ${invite.challenge.title}`
  );

  return { success: true, challengeId: invite.challengeId, challengeSlug: invite.challenge.slug };
}

export async function processEngagementPostAttempt(userId: string, attemptId: string) {
  const profile = await getPerformanceOverview(userId);

  if (profile.totalAttempts === 1) {
    await awardMilestone(
      userId,
      AchievementType.FIRST_CHALLENGE,
      "Completed your first challenge!"
    );
  }

  if (profile.currentStreak >= 7) {
    await awardMilestone(userId, AchievementType.STREAK_7, "Achieved a 7-day competitive streak!");
  }

  // Can also check for Top 100
  if (profile.rank && profile.rank <= 100) {
    await awardMilestone(
      userId,
      AchievementType.TOP_100,
      `Entered the Global Top 100 at rank #${profile.rank}!`
    );
  }
}
