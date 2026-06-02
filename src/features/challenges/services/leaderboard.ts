"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { LeaderboardResponse } from "@/types/challenge";

/**
 * Get the leaderboard for a specific challenge.
 * Returns data for both LIVE (live rankings) and ENDED (frozen rankings) challenges.
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
      leaderboardFrozen: true,
    },
  });

  if (!challenge) return null;

  // Leaderboard not available for DRAFT or SCHEDULED challenges
  if (challenge.status === "DRAFT" || challenge.status === "SCHEDULED") {
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
            examCategory: true,
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
      examCategory: entry.user.examCategory,
      score: entry.score,
      accuracy: entry.accuracy,
      timeTakenInSeconds: entry.timeTakenInSeconds,
      frozenAt: entry.frozenAt,
    })),
    totalParticipants: totalCount,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    userRank,
    isFrozen: challenge.leaderboardFrozen,
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

import { unstable_cache } from "next/cache";

/**
 * Get category-based leaderboard — aggregated across all challenges in a category.
 * Uses the category field on LeaderboardEntry for efficient filtering.
 */
export async function getCategoryLeaderboard(category: string, limit: number = 50) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return getCachedCategoryLeaderboard(category, limit);
}

const getCachedCategoryLeaderboard = unstable_cache(
  async (category: string, limit: number) => {
    // Filter by category field on leaderboard entries (indexed)
    const results = await prisma.leaderboardEntry.findMany({
      where: {
        category,
        challenge: {
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
            examCategory: true,
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
        examCategory: string | null;
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
          examCategory: entry.user.examCategory,
          totalScore: entry.score,
          totalAccuracy: entry.accuracy,
          challengeCount: 1,
        });
      }
    }

    // Sort by total score descending
    const sorted = Array.from(userScores.values())
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        const avgA = a.challengeCount > 0 ? a.totalAccuracy / a.challengeCount : 0;
        const avgB = b.challengeCount > 0 ? b.totalAccuracy / b.challengeCount : 0;
        return avgB - avgA;
      })
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        username: user.username,
        name: user.name,
        image: user.image,
        examCategory: user.examCategory,
        totalScore: user.totalScore,
        averageAccuracy:
          user.challengeCount > 0 ? Math.round(user.totalAccuracy / user.challengeCount) : 0,
        challengesCompleted: user.challengeCount,
      }));

    return sorted;
  },
  ["category-leaderboard"],
  { revalidate: 300, tags: ["leaderboard"] }
);
