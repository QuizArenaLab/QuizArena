import { requireAdmin } from "@/features/rbac/constants/authorization";
import { AdminWorkspaceGuard } from "@/components/guards/AdminWorkspaceGuard";
import { CompetitionStudioLayout } from "@/features/admin/competition/components/CompetitionStudioLayout";
import { CompetitionService } from "@/features/admin/competition/services/competition.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Clock,
  Target,
  Trophy,
  Users,
  ShieldCheck,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default async function CompetitionOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAdmin();
  if (!user || !user.id) return null;
  const competition = await CompetitionService.getCompetitionById(id);

  if (!competition) {
    notFound();
  }

  return (
    <AdminWorkspaceGuard userId={user.id as string} role={user.role as any}>
      <CompetitionStudioLayout competitionId={competition.id} title={competition.title}>
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-bold text-navy">{competition.status}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-lg font-bold text-navy truncate">{competition.competitionType}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Questions</p>
              <p className="text-lg font-bold text-navy">{competition.totalQuestions}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-lg font-bold text-navy">{competition.durationMinutes}m</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Health Configuration Checklist */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                Configuration Health
              </h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Rule 1 */}
              <div className="flex items-start gap-4">
                {competition.config ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-navy">Rules & Behavior</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {competition.config
                      ? "Competition rules, negative marking, and layout configured."
                      : "Rules and test behaviors are not yet configured."}
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="flex items-start gap-4">
                {competition.eligibility ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-navy">Eligibility Criteria</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {competition.eligibility
                      ? "Target audience and restrictions are defined."
                      : "Define who can participate in this competition."}
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="flex items-start gap-4">
                {competition.economics ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-navy">Economics & Rewards</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {competition.economics
                      ? "Entry fees and reward pool are configured."
                      : "Set up pricing or keep it free to enter."}
                  </p>
                </div>
              </div>

              {/* Rule 4 */}
              <div className="flex items-start gap-4">
                {competition.questions.length > 0 ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-navy">Questions Attached</h4>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    {competition.questions.length > 0
                      ? `${competition.questions.length} questions have been added.`
                      : "No questions attached. The competition cannot be published."}
                  </p>
                  {competition.questions.length === 0 && (
                    <Link
                      href={`/admin/dashboard/competitions/${competition.id}/builder`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Open Assessment Builder
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Optional placeholder for future) */}
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl shadow-sm text-white p-6 md:p-8 flex flex-col items-start justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Ready to go live?</h3>
              <p className="text-orange-100 max-w-sm mb-6 text-sm leading-relaxed">
                Make sure all configuration health checks are green. Once published, participants
                can enroll and compete.
              </p>
              <button className="bg-white text-orange-600 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
                Go to Publish Center
              </button>
            </div>
            {/* Decorative background element */}
            <Trophy className="absolute -right-6 -bottom-6 w-48 h-48 text-white opacity-10 rotate-12" />
          </div>
        </div>
      </CompetitionStudioLayout>
    </AdminWorkspaceGuard>
  );
}
