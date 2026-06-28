import { getCompetitionInsights } from "@/features/competitions/experience/actions/landing.actions";
import { TrendingUp, Clock, Target, BarChart, Percent } from "lucide-react";

interface DifficultyInsightsProps {
  slug: string;
}

export async function DifficultyInsights({ slug }: DifficultyInsightsProps) {
  const insights = await getCompetitionInsights(slug);

  if (!insights) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-indigo-400" />
        Difficulty Insights
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
          <div className="text-slate-500 mb-2"><Clock className="w-5 h-5" /></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Completion</p>
          <p className="font-bold text-slate-200">{insights.estimatedTime}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
          <div className="text-slate-500 mb-2"><Target className="w-5 h-5" /></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recommended Level</p>
          <p className="font-bold text-slate-200">{insights.recommendedSkillLevel}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
          <div className="text-slate-500 mb-2"><BarChart className="w-5 h-5" /></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Difficulty Mix</p>
          <p className="font-bold text-slate-200">{insights.difficultyDistribution}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
          <div className="text-slate-500 mb-2"><Percent className="w-5 h-5" /></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Success Rate</p>
          <p className="font-bold text-slate-200">{insights.successRate}</p>
        </div>
      </div>
    </section>
  );
}
