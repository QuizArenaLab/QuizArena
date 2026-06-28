import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCompetitionLanding, getEligibilityStatus, getUserSessionState } from "@/features/competitions/experience/actions/landing.actions";
import { LandingHero } from "./components/LandingHero";
import { EligibilityPanel } from "./components/EligibilityPanel";
import { CompetitionSnapshot } from "./components/CompetitionSnapshot";
import { RewardsPreview } from "./components/RewardsPreview";
import { DifficultyInsights } from "./components/DifficultyInsights";
import { LeaderboardPreview } from "./components/LeaderboardPreview";
import { RulesSummary } from "./components/RulesSummary";
import { MandatoryInstructions } from "./components/MandatoryInstructions";
import { RecommendationPanel } from "./components/RecommendationPanel";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Competition Overview | QuizArena",
  description: "Review competition rules, check eligibility, and start your assessment.",
};

interface CompetitionEntryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompetitionEntryPage({ params }: CompetitionEntryPageProps) {
  const { slug } = await params;

  // 1. Fetch core metadata (Cached ideally)
  const competition = await getCompetitionLanding(slug);
  if (!competition) {
    notFound();
  }

  // 2. Fetch Eligibility & Session state (Dynamic)
  const [{ isEligible, details }, sessionState] = await Promise.all([
    getEligibilityStatus(slug),
    getUserSessionState(slug),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. Hero as Decision Panel */}
        <LandingHero 
          competition={competition}
          isEligible={isEligible}
          eligibilityDetails={details}
          sessionState={sessionState?.status ?? null}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 2. Eligibility Requirements */}
            <EligibilityPanel details={details} />
            
            {/* 3. Competition Snapshot */}
            <CompetitionSnapshot competition={competition} />
            
            {/* 4. Rewards (Streamed) */}
            <Suspense fallback={<SectionSkeleton />}>
              <RewardsPreview slug={slug} />
            </Suspense>

            {/* 5. Difficulty Insights (Streamed) */}
            <Suspense fallback={<SectionSkeleton />}>
              <DifficultyInsights slug={slug} />
            </Suspense>

            {/* 6. Leaderboard Preview (Streamed) */}
            <Suspense fallback={<SectionSkeleton />}>
              <LeaderboardPreview slug={slug} />
            </Suspense>
          </div>

          <div className="space-y-8">
            {/* 7. Rules */}
            <Suspense fallback={<SectionSkeleton />}>
              <RulesSummary slug={slug} />
            </Suspense>

            {/* 8. Recommendation Panel (Streamed) */}
            <Suspense fallback={<SectionSkeleton />}>
              <RecommendationPanel slug={slug} />
            </Suspense>

            {/* 9. Instructions */}
            <MandatoryInstructions 
              competitionId={competition.id} 
              version={competition.version} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex items-center justify-center min-h-[200px]">
      <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
    </div>
  );
}
