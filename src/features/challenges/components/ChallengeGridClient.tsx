"use client";

import { useState } from "react";
import { ChallengePreviewModal } from "./ChallengePreviewModal";
import { Target, Clock, Trophy, Play, Users, Shield, Award } from "lucide-react";
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Arena Preparing Next Competition</h3>
        <p className="text-gray-500 text-sm mb-4">
          New national competitions are published regularly.
        </p>
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Notify Me
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className="group relative bg-white rounded-xl border border-gray-200 p-5 cursor-pointer transition-all duration-180 ease-out hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 flex flex-col h-full"
          >
            {/* Top */}
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> LIVE CHALLENGE
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                {challenge.difficulty}
              </span>
            </div>
            
            {/* Middle */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {challenge.title}
              </h3>
              
              <div className="mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {challenge.category
                    ? EXAM_CATEGORY_LABELS[challenge.category as keyof typeof EXAM_CATEGORY_LABELS] ||
                      challenge.category
                    : "General Competition"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-bold text-gray-600">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span>{challenge.totalQuestions} Qs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{challenge.durationInMinutes}m</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 text-emerald-600">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>
                    {challenge.participantsCount ||
                      (challenge.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                        400) +
                        100} Participants
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-4 border-t border-gray-100 space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> National Ranking
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <Shield className="w-3.5 h-3.5 text-blue-500" /> Leaderboard Points
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <span className="w-3.5 h-3.5 flex items-center justify-center bg-gray-200 rounded-full text-[8px]">₹</span> Entry: Free
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 py-3 rounded-lg font-bold text-sm group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all mt-auto">
               Join Challenge
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
