import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getCompetitionIntelligence = unstable_cache(
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalCompetitions, 
      activeToday, 
      participantsToday, 
      upcomingEvents, 
      passSales, 
      totalUsers
    ] = await Promise.all([
      prisma.challenge.count(),
      prisma.challenge.count({ where: { status: "LIVE" } }),
      prisma.attempt.count({ where: { startedAt: { gte: today } } }),
      prisma.challenge.count({ where: { OR: [{ status: "SCHEDULED" }, { startsAt: { gte: new Date() } }] } }),
      prisma.transaction.count({ where: { status: "COMPLETED" } }),
      prisma.user.count(),
    ]);

    const conversionRate = totalUsers > 0 ? Math.round((passSales / totalUsers) * 100) : 0;

    return {
      totalCompetitions,
      activeToday,
      participantsToday,
      upcomingEvents,
      conversionRate: `${conversionRate}%`,
      passSales,
    };
  },
  ["admin-competition-intelligence"],
  { revalidate: 60, tags: ["admin", "intelligence"] }
);
