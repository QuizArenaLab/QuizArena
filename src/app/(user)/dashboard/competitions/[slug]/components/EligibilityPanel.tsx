import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { EligibilityDetail } from "@/features/competitions/experience/actions/landing.actions";

interface EligibilityPanelProps {
  details: EligibilityDetail[];
}

export function EligibilityPanel({ details }: EligibilityPanelProps) {
  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">Eligibility Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800/50">
            {detail.status === "ELIGIBLE" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            ) : detail.status === "NOT_ELIGIBLE" ? (
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-slate-200">{detail.requirement}</p>
              {detail.message && (
                <p className="text-xs text-slate-400 mt-1">{detail.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
