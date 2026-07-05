"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { processEvaluation } from "@/features/competitions/evaluation/actions/evaluation.actions";

export default function CompetitionProcessingPage({ params }: { params: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sid = searchParams.get("sid");
  
  const [status, setStatus] = useState<"QUEUED" | "EVALUATING" | "COMPLETED" | "FAILED">("QUEUED");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sid) {
      setStatus("FAILED");
      setErrorMsg("No submission ID provided.");
      return;
    }

    let isMounted = true;

    const runEvaluation = async () => {
      setStatus("EVALUATING");
      try {
        const res = await processEvaluation(sid);
        if (!isMounted) return;

        if (res.success && res.data) {
          setStatus("COMPLETED");
          // Add a small delay for better UX before redirecting
          setTimeout(() => {
            if (isMounted) {
              router.push(`/dashboard/competitions/${params.slug}/results?rid=${res.data.resultId}`);
            }
          }, 1500);
        } else {
          setStatus("FAILED");
          setErrorMsg(res.error || "Evaluation failed.");
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("FAILED");
          setErrorMsg(err.message || "An unexpected error occurred.");
        }
      }
    };

    runEvaluation();

    return () => {
      isMounted = false;
    };
  }, [sid, params.slug, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center flex flex-col items-center">
        <div className="relative mb-6">
          <div className={`absolute inset-0 rounded-full animate-ping ${status === "FAILED" ? "bg-red-500/20" : status === "COMPLETED" ? "bg-emerald-500/20" : "bg-blue-500/20"}`} />
          <div className="relative bg-slate-800 p-4 rounded-full border border-slate-700">
            {status === "FAILED" ? (
              <AlertTriangle className="w-12 h-12 text-red-500" />
            ) : status === "COMPLETED" ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            ) : (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          {status === "FAILED" ? "Evaluation Failed" : status === "COMPLETED" ? "Evaluation Complete" : "Processing Submission"}
        </h1>
        <p className="text-slate-400 mb-8">
          {status === "FAILED" ? errorMsg : status === "COMPLETED" ? "Redirecting to your results..." : "Your answers have been securely saved. The evaluation engine is currently processing your submission. Results will be available shortly."}
        </p>

        {status !== "COMPLETED" && (
          <div className={`flex items-center justify-center gap-3 text-sm font-medium ${status === "FAILED" ? "text-red-500" : "text-slate-500"} bg-slate-950/50 py-3 px-6 rounded-xl border border-slate-800 mb-8 w-full`}>
            {status === "EVALUATING" && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {status === "FAILED" ? "Processing halted." : "Evaluating answers..."}
          </div>
        )}

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
