import Link from "next/link";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Processing Submission | QuizArena",
};

export default function CompetitionProcessingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
          <div className="relative bg-slate-800 p-4 rounded-full border border-slate-700">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Submission Received</h1>
        <p className="text-slate-400 mb-8">
          Your answers have been securely saved. The evaluation engine is currently processing your
          submission. Results will be available shortly.
        </p>

        <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-500 bg-slate-950/50 py-3 px-6 rounded-xl border border-slate-800 mb-8 w-full">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          Evaluating answers...
        </div>

        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
