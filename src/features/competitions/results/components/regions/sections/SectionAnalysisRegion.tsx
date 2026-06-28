import { CompetitionResultReadModel } from "../../../types/results.types";

export function SectionAnalysisRegion({ data }: { data: CompetitionResultReadModel }) {
  if (!data.sections || data.sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Section Analysis</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.sections.map(section => (
          <div key={section.sectionId} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">{section.sectionName}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy</span>
                <span className="text-white font-medium">{section.accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Time</span>
                <span className="text-white font-medium">{section.averageTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Completion</span>
                <span className="text-white font-medium">{section.completionRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
