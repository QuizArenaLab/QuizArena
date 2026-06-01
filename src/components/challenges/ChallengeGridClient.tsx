"use client";

import { useState } from "react";
import { ChallengePreviewModal } from "./ChallengePreviewModal";
import { Target, Clock, Trophy, Play, Users } from "lucide-react";
import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";

// Using a simplified type to match the Prisma return payload
type BaseChallenge = {
  id: string;
  title: string;
  slug: string;
  totalQuestions: number;
  durationInMinutes: number;
  difficulty: string;
  category: string | null;
  participantsCount?: number;
};

interface ChallengeGridClientProps {
  challenges: BaseChallenge[];
}

export function ChallengeGridClient({ challenges }: ChallengeGridClientProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<BaseChallenge | null>(null);

  if (challenges.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Next ranked competition will appear here.</h3>
        <p className="text-gray-500 text-sm mb-4">
          Compete to earn leaderboard positions, percentile rankings and achievement badges.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh Arena
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className="group relative bg-white rounded-xl border border-gray-200 p-5 cursor-pointer transition-all duration-180 ease-out hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                {challenge.category
                  ? EXAM_CATEGORY_LABELS[challenge.category as keyof typeof EXAM_CATEGORY_LABELS] ||
                    challenge.category
                  : "Competition"}
              </span>
              <span className="text-xs font-mono font-bold text-gray-500">
                {challenge.difficulty}
              </span>
            </div>
            
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                <Trophy className="w-3 h-3" /> Ranking Enabled
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-1">
              {challenge.title}
            </h3>

            <div className="flex items-center gap-4 mb-5 text-xs text-gray-500 font-mono">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-gray-400" />
                <span>{challenge.totalQuestions} Qs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{challenge.durationInMinutes}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {challenge.participantsCount ||
                    (challenge.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                      400) +
                      100}
                </span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 py-2.5 rounded-lg font-bold text-sm group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all">
              <Play className="w-3.5 h-3.5 fill-current" /> Join Now
            </button>
          </div>
        ))}
      </div>

      <ChallengePreviewModal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        challenge={selectedChallenge}
      />
    </>
  );
}
