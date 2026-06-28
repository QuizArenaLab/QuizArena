import { getResultReadModel } from "@/features/competitions/results/actions/results.actions";
import { TopRegion } from "@/features/competitions/results/components/regions/top/TopRegion";
import { MetricsRegion } from "@/features/competitions/results/components/regions/metrics/MetricsRegion";
import { QuestionReviewRegion } from "@/features/competitions/results/components/regions/review/QuestionReviewRegion";
import { SectionAnalysisRegion } from "@/features/competitions/results/components/regions/sections/SectionAnalysisRegion";
import { InsightsRegion } from "@/features/competitions/results/components/regions/insights/InsightsRegion";
import { RecommendationsRegion } from "@/features/competitions/results/components/regions/recommendations/RecommendationsRegion";
import { ActionRegion } from "@/features/competitions/results/components/regions/action/ActionRegion";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function CompetitionResultsPage({ params }: { params: { attemptId: string } }) {
  const result = await getResultReadModel(params.attemptId);

  if (!result.success || !result.data) {
    if (result.error === "Unauthorized") redirect("/login");
    notFound();
  }

  const data = result.data;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Region: Hero */}
        <TopRegion data={data} />

        {/* Metrics Region */}
        <MetricsRegion data={data} />

        {/* Dynamic / Async Regions */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content (Review & Sections) */}
          <div className="lg:col-span-2 space-y-12">
            <SectionAnalysisRegion data={data} />
            
            <Suspense fallback={<div className="animate-pulse h-64 bg-slate-900 rounded-xl" />}>
              <QuestionReviewRegion data={data} />
            </Suspense>
          </div>

          {/* Sidebar (Insights & Recommendations) */}
          <div className="space-y-12">
            <Suspense fallback={<div className="animate-pulse h-64 bg-slate-900 rounded-xl" />}>
              <InsightsRegion data={data} />
            </Suspense>
            
            <Suspense fallback={<div className="animate-pulse h-64 bg-slate-900 rounded-xl" />}>
              <RecommendationsRegion data={data} />
            </Suspense>

            <ActionRegion data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
