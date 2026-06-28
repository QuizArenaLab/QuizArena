import { getCompetitionRules } from "@/features/competitions/experience/actions/landing.actions";
import { AlertCircle, FileText } from "lucide-react";

interface RulesSummaryProps {
  slug: string;
}

export async function RulesSummary({ slug }: RulesSummaryProps) {
  const rules = await getCompetitionRules(slug);

  if (!rules || rules.length === 0) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          Rules Summary
        </h2>
        {/* In the future, this can open a modal with full rules */}
        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
          <FileText className="w-4 h-4" />
          View Complete Rules
        </button>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
            <span className="text-sm leading-relaxed">{rule}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
