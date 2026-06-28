import { CompetitionResultReadModel } from "../../../types/results.types";

export function TopRegion({ data }: { data: CompetitionResultReadModel }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">{data.competitionTitle}</h1>
        <p className="text-slate-400 mb-6">Completed on {new Date(data.attemptDate).toLocaleDateString()}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <p className={`text-2xl font-bold ${data.status === "PASSED" ? "text-green-500" : "text-yellow-500"}`}>
              {data.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Score</p>
            <p className="text-2xl font-bold text-white">{data.score} <span className="text-lg text-slate-500">/ {data.maxScore}</span></p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-white">{data.accuracy.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Time Taken</p>
            <p className="text-2xl font-bold text-white">{Math.floor(data.timeTakenInSeconds / 60)}m {data.timeTakenInSeconds % 60}s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
