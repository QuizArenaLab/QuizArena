import { getRecommendations } from "@/features/competitions/experience/actions/landing.actions";
import { Lightbulb, Sparkles } from "lucide-react";

interface RecommendationPanelProps {
  slug: string;
}

export async function RecommendationPanel({ slug }: RecommendationPanelProps) {
  const recommendations = await getRecommendations(slug);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        Why This Competition?
      </h2>
      <ul className="space-y-4">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800/50">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-slate-300 font-medium leading-relaxed">{rec.reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
