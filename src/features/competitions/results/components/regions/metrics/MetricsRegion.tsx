import { CompetitionResultReadModel } from "../../../types/results.types";
import { CheckCircle, XCircle, SkipForward, Target, Award, Clock } from "lucide-react";

export function MetricsRegion({ data }: { data: CompetitionResultReadModel }) {
  const metrics = [
    { label: "Correct Answers", value: data.correctAnswers, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
    { label: "Incorrect Answers", value: data.incorrectAnswers, icon: <XCircle className="w-5 h-5 text-red-500" /> },
    { label: "Skipped", value: data.skippedQuestions, icon: <SkipForward className="w-5 h-5 text-slate-500" /> },
    { label: "Completion Rate", value: `${data.completionRate.toFixed(1)}%`, icon: <Target className="w-5 h-5 text-blue-500" /> },
    { label: "Percentage", value: `${data.percentage.toFixed(1)}%`, icon: <Award className="w-5 h-5 text-yellow-500" /> },
    { label: "Avg Time / Question", value: `${data.averageTimePerQuestion.toFixed(1)}s`, icon: <Clock className="w-5 h-5 text-purple-500" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg">
            {m.icon}
          </div>
          <div>
            <p className="text-sm text-slate-400">{m.label}</p>
            <p className="text-xl font-bold text-white">{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
