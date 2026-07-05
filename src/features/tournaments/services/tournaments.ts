"use server";

import { prisma } from "@/lib/prisma";
import { withAuth, withAdmin } from "@/lib/auth-utils";
import { calculateAggregateTournamentStats } from "@/lib/tournament-engine";
import { SeasonStatus, TournamentStatus } from "@/generated/prisma";

export async function createSeason(data: {
  name: string;
  slug: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  category?: any; // ExamCategory
  bannerImage?: string;
}) {
  return await withAdmin(async () => {
    return await prisma.season.create({
      data: {
        ...data,
        status: SeasonStatus.UPCOMING,
      },
    });
  });
}

export async function createTournament(data: {
  seasonId: string;
  title: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  visibility?: any;
  participationType?: any;
  challengeIds: string[];
}) {
  return await withAdmin(async () => {
    const { challengeIds, ...tournamentData } = data;

    const tournament = await prisma.tournament.create({
      data: {
        ...tournamentData,
        status: TournamentStatus.UPCOMING,
      },
    });

    if (challengeIds.length > 0) {
      const challengesData = challengeIds.map((id, index) => ({
        tournamentId: tournament.id,
        challengeId: id,
        order: index,
      }));
      await prisma.tournamentChallenge.createMany({
        data: challengesData,
      });
    }

    return tournament;
  });
}

export async function joinTournament(tournamentId: string) {
  return await withAuth(async (user) => {
    if (!user.id) throw new Error("Unauthorized");
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { season: true },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.status !== TournamentStatus.ACTIVE) {
      throw new Error("Tournament is not currently active");
    }

    // Check if a leaderboard entry already exists to prevent duplicate attempts
    const existingEntry = await prisma.tournamentLeaderboard.findUnique({
      where: {
        userId_tournamentId: {
          userId: user.id,
          tournamentId: tournament.id,
        },
      },
    });

    if (existingEntry) {
      throw new Error("Already participating in this tournament");
    }

    // Create the leaderboard entry with 0 scores to signify enrollment
    return await prisma.tournamentLeaderboard.create({
      data: {
        userId: user.id,
        tournamentId: tournament.id,
        totalScore: 0,
        averageAccuracy: 0,
        totalChallengesCompleted: 0,
      },
    });
  });
}

export async function getSeasonProgress(seasonId: string) {
  return await withAuth(async (user) => {
    if (!user.id) throw new Error("Unauthorized");
    const leaderboards = await prisma.tournamentLeaderboard.findMany({
      where: {
        userId: user.id,
        tournament: { seasonId },
      },
      include: { tournament: true },
    });

    const totalScore = leaderboards.reduce((acc, curr) => acc + curr.totalScore, 0);
    const completedTournaments = leaderboards.length;
    const averageAccuracy =
      completedTournaments > 0
        ? leaderboards.reduce((acc, curr) => acc + curr.averageAccuracy, 0) / completedTournaments
        : 0;

    return {
      totalScore,
      completedTournaments,
      averageAccuracy,
      leaderboards,
    };
  });
}

export async function calculateTournamentLeaderboard(tournamentId: string) {
  return await withAdmin(async () => {
    // In a real scenario, this might process async using a queue for massive tournaments.
    // For MVP, we iterate over leaderboard entries.
    const entries = await prisma.tournamentLeaderboard.findMany({
      where: { tournamentId },
      include: { user: true },
    });

    // Here we would recalculate ranks based on totalScore and averageAccuracy.
    entries.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.averageAccuracy - a.averageAccuracy;
    });

    for (let i = 0; i < entries.length; i++) {
      await prisma.tournamentLeaderboard.update({
        where: { id: entries[i].id },
        data: { rank: i + 1 },
      });
    }

    return { success: true, processedCount: entries.length };
  });
}
