import { Competition, CompetitionConfig } from "@/generated/prisma";
import { CheckCircle2, Timer, FileQuestion, Languages, Hash, Target, Shuffle } from "lucide-react";

interface CompetitionSnapshotProps {
  competition: Competition & { config: CompetitionConfig | null };
}

export function CompetitionSnapshot({ competition }: CompetitionSnapshotProps) {
  const config = competition.config;

  const snapshotItems = [
    { label: "Questions", value: competition.totalQuestions, icon: <FileQuestion /> },
    { label: "Duration", value: `${competition.durationMinutes} mins`, icon: <Timer /> },
    { label: "Maximum Marks", value: competition.maximumMarks, icon: <Target /> },
    { label: "Passing Marks", value: config?.passingMarks ?? "N/A", icon: <CheckCircle2 /> },
    { label: "Negative Marking", value: config?.negativeMarkingEnabled ? `-${config.negativeMarkPerQuestion}` : "None", icon: <Hash /> },
    { label: "Attempts Allowed", value: config?.allowRetake ? "Multiple" : "1", icon: <CheckCircle2 /> },
    { label: "Language", value: competition.language.toUpperCase(), icon: <Languages /> },
    { label: "Randomization", value: (config?.randomizeQuestions || config?.randomizeOptions) ? "Yes" : "No", icon: <Shuffle /> },
  ];

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">Competition Snapshot</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {snapshotItems.map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex flex-col items-start">
            <div className="text-slate-500 mb-2 [&>svg]:w-5 [&>svg]:h-5">
              {item.icon}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="font-bold text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
