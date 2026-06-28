import { redirect } from "next/navigation";
import { checkEligibility } from "@/features/competitions/experience/services/eligibility.service";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertCircle, Play, ShieldAlert, Timer, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Competition Overview | QuizArena",
  description: "Review competition rules and start your assessment.",
};

interface CompetitionEntryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompetitionEntryPage({ params }: CompetitionEntryPageProps) {
  const { slug } = await params;

  // 1. Fetch basic competition metadata
  const competition = await prisma.competition.findUnique({
    where: { slug },
  });

  if (!competition) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Competition Not Found</h2>
        <p className="text-slate-400 mb-6">
          The link might be broken or the competition has been removed.
        </p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // 2. Check eligibility (Live, not already completed)
  const eligibility = await checkEligibility(slug);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            {competition.competitionType.replace("_", " ")}
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">{competition.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {competition.description || "No description provided."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <Stat icon={<Timer />} label="Duration" value={`${competition.durationMinutes} mins`} />
            <Stat icon={<CheckCircle2 />} label="Questions" value={competition.totalQuestions} />
            <Stat icon={<CheckCircle2 />} label="Marks" value={competition.maximumMarks} />
            <Stat icon={<ShieldAlert />} label="Difficulty" value={competition.difficulty} />
          </div>
        </div>

        {/* Rules Section */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertCircle className="text-amber-500" />
            Important Instructions
          </h2>
          <ul className="space-y-4 text-slate-300 list-disc pl-5">
            <li>Ensure you have a stable internet connection before starting.</li>
            <li>
              Do not switch tabs or minimize the browser window. Anti-cheat monitoring is active.
            </li>
            <li>Your answers will be saved automatically as you progress.</li>
            <li>If the timer expires, your session will be automatically submitted.</li>
            <li>
              You can mark questions for review and return to them later using the question palette.
            </li>
          </ul>
        </div>

        {/* Action Section */}
        <div className="pt-4 flex items-center justify-center">
          {!eligibility.success ? (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center w-full max-w-md">
              <h3 className="font-bold text-red-400 mb-2">Cannot Start</h3>
              <p className="text-slate-300 text-sm mb-4">{eligibility.error}</p>
              <Link
                href="/dashboard"
                className="text-red-400 hover:text-red-300 text-sm font-semibold underline"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href={`/dashboard/competitions/${slug}/workspace`}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-900/20 hover:scale-105"
            >
              <span>Start Assessment</span>
              <Play className="w-5 h-5 fill-current" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
      <div className="text-slate-400 mb-1 [&>svg]:w-5 [&>svg]:h-5">{icon}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="font-bold text-white">{value}</div>
    </div>
  );
}
