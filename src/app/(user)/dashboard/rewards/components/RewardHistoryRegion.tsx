import { UserRewardsReadModel } from "@/features/competitions/rewards/read-model/RewardReadModel";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export function RewardHistoryRegion({ data }: { data: UserRewardsReadModel }) {
  if (data.history.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Audit Ledger</h3>
      <div className="space-y-4">
        {data.history.map((record) => (
          <div key={record.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800/50">
            <div className="mt-1">
              {record.status === "SUCCESS" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {record.status === "FAILED" && <XCircle className="w-5 h-5 text-red-500" />}
              {record.status === "PENDING" && <Clock className="w-5 h-5 text-yellow-500" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-white">{record.event}</p>
                <span className="text-xs text-slate-500">{new Date(record.date).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Type: {record.type}</p>
              {record.reason && (
                <p className="text-xs text-red-400 mt-2 bg-red-500/10 p-2 rounded border border-red-500/20">
                  {record.reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
