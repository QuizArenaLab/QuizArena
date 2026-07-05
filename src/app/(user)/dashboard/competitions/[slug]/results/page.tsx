import { redirect } from "next/navigation";
import { getResultReadModel } from "@/features/competitions/results/actions/results.actions";

// Region imports
import { TopRegion } from "@/features/competitions/results/components/regions/top/TopRegion";
import { MetricsRegion } from "@/features/competitions/results/components/regions/metrics/MetricsRegion";
import { SectionAnalysisRegion } from "@/features/competitions/results/components/regions/sections/SectionAnalysisRegion";
import { QuestionReviewRegion } from "@/features/competitions/results/components/regions/review/QuestionReviewRegion";
import { InsightsRegion } from "@/features/competitions/results/components/regions/insights/InsightsRegion";
import { RecommendationsRegion } from "@/features/competitions/results/components/regions/recommendations/RecommendationsRegion";
import { ActionRegion } from "@/features/competitions/results/components/regions/action/ActionRegion";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Competition Results | QuizArena",
};

export default async function CompetitionResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rid: string }>;
}) {
  const { slug } = await params;
  const { rid } = await searchParams;

  if (!rid) {
    redirect(`/dashboard/competitions/${slug}`);
  }

  const result = await getResultReadModel(rid);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Results Unavailable</h1>
        <p className="text-slate-400 max-w-md">
          {result.error || "We couldn't load your results at this time. Please try again later."}
        </p>
      </div>
    );
  }

  const readModel = result.data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <TopRegion data={readModel} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Core Metrics row */}
        <MetricsRegion data={readModel} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content: Section Analysis & Question Review */}
          <div className="lg:col-span-2 space-y-8">
            {readModel.sections && readModel.sections.length > 0 && (
              <SectionAnalysisRegion data={readModel} />
            )}
            
            <QuestionReviewRegion data={readModel} />
          </div>

          {/* Sidebar: Insights, Recommendations, Actions */}
          <div className="space-y-8">
            <InsightsRegion data={readModel} />
            <RecommendationsRegion data={readModel} />
            <ActionRegion data={readModel} />
          </div>
        </div>
      </main>
    </div>
  );
}
