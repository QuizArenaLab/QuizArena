import { LeaderboardReadModel } from "../../../read-model/LeaderboardReadModel";

export function HeroRegion({ data }: { data: LeaderboardReadModel }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">{data.metadata.title}</h1>
        <p className="text-slate-400 text-sm">
          Last updated: {new Date(data.metadata.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
