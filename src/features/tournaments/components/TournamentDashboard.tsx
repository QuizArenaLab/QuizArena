"use client";

import { SeasonalBanner } from "./SeasonalBanner";
import { EventCountdown } from "./EventCountdown";
import { TournamentProgress } from "./TournamentProgress";
import { SeasonalLeaderboard } from "./SeasonalLeaderboard";
import { TournamentWithDetails } from '@/types/tournaments';

interface TournamentDashboardProps {
  tournament: TournamentWithDetails;
  seasonName: string;
  category: string;
  bannerImage: string | null;
  currentUserId: string;
}

export function TournamentDashboard({
  tournament,
  seasonName,
  category,
  currentUserId,
}: TournamentDashboardProps) {
  // Find current user's progress
  const userEntry = tournament.leaderboard.find((l) => l.userId === currentUserId);
  const totalChallenges = tournament.challenges.length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <SeasonalBanner
        seasonName={seasonName}
        category={category}
        description={tournament.description}
        status={tournament.status as any}
        endsAt={tournament.endsAt}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <EventCountdown
            targetDate={tournament.status === "UPCOMING" ? tournament.startsAt : tournament.endsAt}
            label={tournament.status === "UPCOMING" ? "Starts In" : "Ends In"}
          />

          <TournamentProgress
            totalChallenges={totalChallenges}
            completedChallenges={userEntry?.totalChallengesCompleted || 0}
            totalScore={userEntry?.totalScore || 0}
            averageAccuracy={userEntry?.averageAccuracy || 0}
            currentRank={userEntry?.rank || null}
          />

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Challenges Queue
            </h3>
            <div className="space-y-3">
              {tournament.challenges.map((tc, index) => (
                <div
                  key={tc.id}
                  className="p-3 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Challenge {index + 1}
                    </span>
                    <p className="text-sm font-bold text-gray-900">{tc.challenge.title}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {tc.challenge.durationInMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <SeasonalLeaderboard entries={tournament.leaderboard} currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
}
