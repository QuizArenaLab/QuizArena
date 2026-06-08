import { Suspense } from "react";
import {
  Database,
  CheckCircle2,
  ClipboardList,
  FileEdit,
  Archive,
  AlertTriangle,
  FileText,
  Tag,
  Map,
  Copy,
  Clock,
  FilePlus,
  CheckCircle,
  XCircle,
  Activity,
  GitPullRequest,
  Check,
  Plus,
  UploadCloud,
  CheckSquare,
  ArrowRight,
} from "lucide-react";
import {
  getQuestionBankOverview,
  getContentHealthMetrics,
  getReviewQueueSnapshot,
  getRecentPublishingActivity,
} from "@/features/admin/services/question-bank-dashboard";
import { KPICard } from "@/features/admin/components/question-bank/KPICard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Bank Operations | QuizArena Admin",
  description: "Manage and curate the QuizArena question repository",
};

// Formatting helper
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

async function OverviewContent() {
  const [overview, contentHealth, reviewSnapshot, recentPublishing] = await Promise.all([
    getQuestionBankOverview(),
    getContentHealthMetrics(),
    getReviewQueueSnapshot(),
    getRecentPublishingActivity(10), // Fetched more for timeline scroll
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI Hierarchy */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            label="Total Questions"
            value={overview.totalQuestions}
            icon={Database}
            variant="primary"
          />
          <KPICard
            label="Published"
            value={overview.publishedQuestions}
            icon={CheckCircle2}
            variant="primary"
          />
          <KPICard
            label="Pending Review"
            value={overview.pendingReview}
            icon={ClipboardList}
            variant="primary"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            label="Drafts"
            value={overview.draftQuestions}
            icon={FileEdit}
            variant="secondary"
          />
          <KPICard
            label="Archived"
            value={overview.archivedQuestions}
            icon={Archive}
            variant="secondary"
          />
          <KPICard
            label="Failed Imports"
            value={overview.failedImports}
            icon={AlertTriangle}
            variant="secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Health Center */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Content Health Center</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Metrics requiring moderation attention
              </p>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm text-slate-500">
              <Activity className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex-1 divide-y divide-slate-100/80">
            <HealthRow
              icon={FileText}
              label="Missing Explanations"
              count={contentHealth.missingExplanations}
              severity="HIGH"
            />
            <HealthRow
              icon={Tag}
              label="Missing Tags"
              count={contentHealth.missingTags}
              severity="MEDIUM"
            />
            <HealthRow
              icon={Map}
              label="Missing Topic Mapping"
              count={contentHealth.missingTopicMapping}
              severity="MEDIUM"
            />
            <HealthRow
              icon={Copy}
              label="Duplicate Candidates"
              count={contentHealth.duplicateCandidates}
              severity="LOW"
            />
          </div>
        </div>

        {/* Review Queue Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Review Queue Snapshot</h3>
              <p className="text-[11px] text-slate-500 mt-1">Daily workflow status</p>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm text-slate-500">
              <GitPullRequest className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <QueueCard
              icon={FilePlus}
              label="Draft Questions"
              count={reviewSnapshot.draftQuestions}
              link="/dashboard/admin/questions?status=DRAFT"
              linkText="Open Queue"
            />
            <QueueCard
              icon={Clock}
              label="Pending Review"
              count={reviewSnapshot.pendingReview}
              link="/dashboard/admin/questions?status=PENDING_REVIEW"
              linkText="Review"
            />
            <QueueCard
              icon={CheckCircle}
              label="Approved Today"
              count={reviewSnapshot.approvedToday}
              link="/dashboard/admin/questions?status=PUBLISHED"
              linkText="View"
            />
            <QueueCard
              icon={XCircle}
              label="Rejected Today"
              count={reviewSnapshot.rejectedToday}
              link="/dashboard/admin/questions?status=REJECTED"
              linkText="View"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Publishing Activity Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Publishing Timeline</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Latest approved additions (Newest first)
              </p>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm text-slate-500">
              <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </div>

          {recentPublishing.length > 0 ? (
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {recentPublishing.map((item, index) => (
                <div key={item.id} className="relative pl-6">
                  {/* Timeline connecting line */}
                  {index !== recentPublishing.length - 1 && (
                    <div className="absolute top-6 bottom-[-24px] left-[11px] w-px bg-slate-200" />
                  )}
                  {/* Timeline dot */}
                  <div className="absolute top-1.5 left-0 w-[22px] h-[22px] rounded-full border-[3px] border-white bg-emerald-500 shadow-sm" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          Published
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          {item.questionCode || item.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 line-clamp-1">{item.question}</p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-900">
                        {formatTimeAgo(item.publishedAt)}
                      </p>
                      <p className="text-[11px] text-slate-500">by {item.publisherName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
              <div className="p-2 bg-white border border-slate-200/60 rounded-xl shadow-sm mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Question Bank Healthy</h4>
              <p className="text-xs text-slate-500 mb-6">
                No publishing actions require attention.
              </p>

              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="p-3 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Last Published
                  </p>
                  <p className="text-xs font-semibold text-slate-900">Unknown</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    This Week
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {overview.publishedQuestions}
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Pending
                  </p>
                  <p className="text-xs font-semibold text-slate-900">{overview.pendingReview}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  count,
  severity,
}: {
  icon: any;
  label: string;
  count: number;
  severity: "HIGH" | "MEDIUM" | "LOW";
}) {
  const isZero = count === 0;

  let badgeColor = "bg-slate-100 text-slate-500";
  if (!isZero) {
    if (severity === "HIGH") badgeColor = "bg-rose-100 text-rose-700";
    else if (severity === "MEDIUM") badgeColor = "bg-orange-100 text-orange-700";
    else badgeColor = "bg-blue-100 text-blue-700";
  }

  return (
    <div className="flex items-center justify-between py-3.5 group">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm text-slate-500">
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
        <div>
          <span
            className={`block text-[13px] font-semibold transition-colors duration-300 ${isZero ? "text-slate-500" : "text-slate-900"}`}
          >
            {label}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}
            >
              {severity}
            </span>
            <span className="text-[11px] font-medium text-slate-500">{count} Questions</span>
          </div>
        </div>
      </div>
      {!isZero && (
        <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group-hover:translate-x-0.5 transform duration-200">
          Review <ArrowRight className="w-3 h-3" />
        </button>
      )}
      {isZero && <Check className="w-4 h-4 text-emerald-500 mr-2" strokeWidth={2} />}
    </div>
  );
}

function QueueCard({
  icon: Icon,
  label,
  count,
  link,
  linkText,
}: {
  icon: any;
  label: string;
  count: number;
  link: string;
  linkText: string;
}) {
  return (
    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 flex flex-col hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 bg-white rounded-md border border-slate-200/60 shadow-sm text-slate-500">
          <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
        </div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="mb-4">
        <span
          className={`text-2xl font-extrabold tabular-nums ${count === 0 ? "text-slate-400" : "text-slate-900"}`}
        >
          {count.toLocaleString()}
        </span>
      </div>
      <Link
        href={link}
        className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1 mt-auto"
      >
        {linkText} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

export default function QuestionsOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading Question Operations…</p>
          </div>
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
