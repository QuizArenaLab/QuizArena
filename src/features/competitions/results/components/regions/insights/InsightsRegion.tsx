import { CompetitionResultReadModel } from "../../../types/results.types";
import { Lightbulb } from "lucide-react";

export function InsightsRegion({ data }: { data: CompetitionResultReadModel }) {
  if (!data.insights || data.insights.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Performance Insights</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.insights.map((insight, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{insight.title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">{insight.description}</p>
            {insight.metricValue && (
              <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-md text-sm font-medium">
                {insight.metricValue}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
