import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import { TournamentDashboard } from '@/features/tournaments/components/TournamentDashboard';
import { requireAuth } from "../../../../lib/session-utils";
import { TournamentWithDetails } from "../../../../types/tournaments";

interface TournamentPageProps {
  params: { seasonSlug: string; tournamentId: string };
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await requireAuth();

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.tournamentId },
    include: {
      season: true,
      challenges: {
        include: {
          challenge: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              difficulty: true,
              totalQuestions: true,
              durationInMinutes: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
      leaderboard: {
        include: {
          user: {
            select: { id: true, name: true, image: true, username: true },
          },
        },
        orderBy: [{ rank: "asc" }, { totalScore: "desc" }],
      },
    },
  });

  if (!tournament || tournament.season.slug !== params.seasonSlug) {
    notFound();
  }

  // Typecast since we fetched exactly what we needed
  const typedTournament = tournament as unknown as TournamentWithDetails;

  return (
    <div className="bg-gray-50 min-h-screen pt-8">
      <div className="px-6">
        <TournamentDashboard
          tournament={typedTournament}
          seasonName={tournament.season.name}
          category={tournament.season.category || "General"}
          bannerImage={tournament.season.bannerImage}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}
