"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { LeaderboardResponse } from "@/types/challenge";

/**
 * Get the leaderboard for a specific challenge.
 * Only returns data if the challenge is ENDED (leaderboard frozen).
 * Includes the requesting user's rank if they participated.
 */
export async function getChallengeLeaderboard(
  challengeId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<LeaderboardResponse | null> {
  const session = await auth();

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      title: true,
      status: true,
      totalQuestions: true,
    },
  });

  if (!challenge) return null;

  // Leaderboard is only visible after challenge ENDS
  if (challenge.status !== "ENDED" && challenge.status !== "ARCHIVED") {
    return null;
  }

  const skip = (page - 1) * pageSize;

  const [entries, totalCount] = await Promise.all([
    prisma.leaderboardEntry.findMany({
      where: { challengeId },
      orderBy: { rank: "asc" },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.leaderboardEntry.count({ where: { challengeId } }),
  ]);

  // Get requesting user's rank if they participated
  let userRank: number | undefined;
  if (session?.user?.id) {
    const userEntry = await prisma.leaderboardEntry.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId: session.user.id,
        },
      },
      select: { rank: true },
    });
    userRank = userEntry?.rank;
  }

  return {
    entries: entries.map((entry) => ({
      rank: entry.rank,
      userId: entry.userId,
      username: entry.user.username,
      name: entry.user.name,
      image: entry.user.image,
      score: entry.score,
      accuracy: entry.accuracy,
      timeTakenInSeconds: entry.timeTakenInSeconds,
      frozenAt: entry.frozenAt,
    })),
    totalParticipants: totalCount,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    userRank,
    isFrozen: true,
  };
}

/**
 * Get the leaderboard for a challenge by slug.
 */
export async function getChallengeLeaderboardBySlug(
  slug: string,
  page: number = 1,
  pageSize: number = 50
): Promise<LeaderboardResponse | null> {
  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!challenge) return null;

  return getChallengeLeaderboard(challenge.id, page, pageSize);
}

/**
 * Get category-based leaderboard — aggregated across all challenges in a category.
 * Returns top performers by total score within a specific ExamCategory.
 */
export async function getCategoryLeaderboard(category: string, limit: number = 50) {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Aggregate scores across all ENDED challenges in this category
  const results = await prisma.leaderboardEntry.findMany({
    where: {
      challenge: {
        category: category as "SSC" | "BANKING" | "RAILWAYS" | "STATE_PSC",
        status: { in: ["ENDED", "ARCHIVED"] },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Aggregate by user
  const userScores = new Map<
    string,
    {
      userId: string;
      username: string | null;
      name: string | null;
      image: string | null;
      totalScore: number;
      totalAccuracy: number;
      challengeCount: number;
    }
  >();

  for (const entry of results) {
    const existing = userScores.get(entry.userId);
    if (existing) {
      existing.totalScore += entry.score;
      existing.totalAccuracy += entry.accuracy;
      existing.challengeCount++;
    } else {
      userScores.set(entry.userId, {
        userId: entry.userId,
        username: entry.user.username,
        name: entry.user.name,
        image: entry.user.image,
        totalScore: entry.score,
        totalAccuracy: entry.accuracy,
        challengeCount: 1,
      });
    }
  }

  // Sort by total score descending
  const sorted = Array.from(userScores.values())
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      username: user.username,
      name: user.name,
      image: user.image,
      totalScore: user.totalScore,
      averageAccuracy:
        user.challengeCount > 0 ? Math.round(user.totalAccuracy / user.challengeCount) : 0,
      challengesCompleted: user.challengeCount,
    }));

  return sorted;
}

/**
 * Get the requesting user's rank in a specific challenge.
 */
export async function getUserChallengeRank(
  challengeId: string
): Promise<{ rank: number; totalParticipants: number } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const entry = await prisma.leaderboardEntry.findUnique({
    where: {
      challengeId_userId: {
        challengeId,
        userId: session.user.id,
      },
    },
    select: { rank: true },
  });

  if (!entry) return null;

  const totalParticipants = await prisma.leaderboardEntry.count({
    where: { challengeId },
  });

  return {
    rank: entry.rank,
    totalParticipants,
  };
}
