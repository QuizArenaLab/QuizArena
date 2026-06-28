import { CompetitionResultReadModel } from "../../../types/results.types";
import { Compass } from "lucide-react";

export function RecommendationsRegion({ data }: { data: CompetitionResultReadModel }) {
  if (!data.recommendations || data.recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Recommendations</h2>
      <div className="space-y-4">
        {data.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg mt-1">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{rec.title}</h3>
              <p className="text-slate-400 text-sm">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
