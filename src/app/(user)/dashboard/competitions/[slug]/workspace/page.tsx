import { redirect } from "next/navigation";
import { initializeSession } from "@/features/competitions/experience/services/session.service";
import { WorkspaceRoot } from "@/features/competitions/workspace/WorkspaceRoot";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Competition Workspace | QuizArena",
};

interface CompetitionWorkspacePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompetitionWorkspacePage({ params }: CompetitionWorkspacePageProps) {
  const { slug } = await params;

  // Initialize or resume the session server-side
  const initResult = await initializeSession(slug);

  if (!initResult.success || !initResult.data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            {initResult.error || "Failed to initialize workspace."}
          </p>
          <Link
            href={`/dashboard/competitions/${slug}`}
            className="inline-flex px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Pass sanitized payload to the client root
  return <WorkspaceRoot payload={initResult.data.workspacePayload} />;
}
