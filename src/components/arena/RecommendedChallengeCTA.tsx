"use client";

import { useState } from "react";
import { ChallengePreviewModal } from "@/components/challenges/ChallengePreviewModal";

interface RecommendedChallengeCTAProps {
  challenge: {
    id: string;
    title: string;
    slug: string;
    totalQuestions: number;
    durationInMinutes: number;
    difficulty: string;
    category: string | null;
  };
  label?: string;
}

export function RecommendedChallengeCTA({ challenge, label = "Begin Training Session" }: RecommendedChallengeCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white h-12 px-8 rounded-xl font-bold tracking-wide hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        {label}
      </button>

      <ChallengePreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        challenge={challenge}
      />
    </>
  );
}
