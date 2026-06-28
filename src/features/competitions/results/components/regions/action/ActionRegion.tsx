import { CompetitionResultReadModel } from "../../../types/results.types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ActionRegion({ data }: { data: CompetitionResultReadModel }) {
  if (!data.nextActions || data.nextActions.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Next Actions</h2>
      <div className="flex flex-wrap gap-4">
        {data.nextActions.map(action => (
          <Link 
            key={action.id} 
            href={action.url || "#"}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors
              ${action.isPrimary 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" 
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }
            `}
          >
            {action.label}
            {action.isPrimary && <ArrowRight className="w-4 h-4" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
