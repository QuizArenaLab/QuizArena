import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  TrendingDown,
  AlertCircle,
  EyeOff,
  Repeat,
  Activity,
  Clock,
  CheckCircle2,
  HelpCircle,
  Brain,
} from "lucide-react";
import { getIntelligenceDashboardMetrics } from "@/features/admin/services/question-bank/analytics/dashboard-engine";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Intelligence | QuizArena",
  description: "Operational intelligence dashboard for question performance monitoring",
};

function PrimaryCard({
  title,
  count,
  icon,
  bgColor,
  textColor,
  borderColor,
  href,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  borderColor: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative p-6 rounded-2xl border-2 ${borderColor} ${bgColor} hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/80 border ${borderColor}`}>{icon}</div>
        {count > 0 && (
          <span className={`text-3xl font-black ${textColor}`}>
            {count.toLocaleString()}
          </span>
        )}
      </div>
      <p className={`text-sm font-bold ${textColor}`}>{title}</p>
      {count === 0 && (
        <p className="text-xs text-gray-400 mt-1">None detected</p>
      )}
      <div className={`absolute bottom-3 right-4 text-xs font-medium ${textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
        View →
      </div>
    </Link>
  );
}

function SecondaryCard({
  title,
  value,
  icon,
  href,
  isPercentage,
  isTime,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
  isPercentage?: boolean;
  isTime?: boolean;
}) {
  const displayValue = isPercentage
    ? `${(value * 100).toFixed(1)}%`
    : isTime
      ? `${value.toFixed(1)}s`
      : value.toLocaleString();

  const content = (
    <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-lg font-bold text-gray-900">{displayValue}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

async function IntelligenceContent() {
  const metrics = await getIntelligenceDashboardMetrics();

  const baseFilterUrl = "/dashboard/admin/question-bank?intelligence=";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard/admin/question-bank"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Question Bank
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            Question Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Operational performance monitoring — all metrics from precomputed aggregates
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Questions Tracked</p>
          <p className="text-2xl font-black text-gray-900">{metrics.totalTracked.toLocaleString()}</p>
        </div>
      </div>

      {/* Primary Cards — Priority Alerts */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Priority Alerts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PrimaryCard
            title="Difficulty Drift"
            count={metrics.difficultyDrift}
            icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
            bgColor="bg-orange-50/80"
            textColor="text-orange-700"
            borderColor="border-orange-200"
            href={`${baseFilterUrl}DIFFICULTY_DRIFT`}
          />
          <PrimaryCard
            title="High Reports"
            count={metrics.highReports}
            icon={<Shield className="w-5 h-5 text-rose-600" />}
            bgColor="bg-rose-50/80"
            textColor="text-rose-700"
            borderColor="border-rose-200"
            href={`${baseFilterUrl}HIGH_REPORTS`}
          />
          <PrimaryCard
            title="Low Confidence"
            count={metrics.lowConfidence}
            icon={<HelpCircle className="w-5 h-5 text-amber-600" />}
            bgColor="bg-amber-50/80"
            textColor="text-amber-700"
            borderColor="border-amber-200"
            href={`${baseFilterUrl}LOW_CONFIDENCE`}
          />
          <PrimaryCard
            title="Declining Performance"
            count={metrics.decliningPerformance}
            icon={<TrendingDown className="w-5 h-5 text-red-600" />}
            bgColor="bg-red-50/80"
            textColor="text-red-700"
            borderColor="border-red-200"
            href={`${baseFilterUrl}DECLINING`}
          />
        </div>
      </div>

      {/* Secondary Cards — Operational Metrics */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Operational Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <SecondaryCard
            title="Healthy"
            value={metrics.healthyQuestions}
            icon={<CheckCircle2 className="w-4 h-4" />}
            href={`${baseFilterUrl}HEALTHY`}
          />
          <SecondaryCard
            title="Unused"
            value={metrics.unusedQuestions}
            icon={<EyeOff className="w-4 h-4" />}
            href={`${baseFilterUrl}UNUSED`}
          />
          <SecondaryCard
            title="Overused"
            value={metrics.overusedQuestions}
            icon={<Repeat className="w-4 h-4" />}
            href={`${baseFilterUrl}OVERUSED`}
          />
          <SecondaryCard
            title="Avg Success Rate"
            value={metrics.avgSuccessRate}
            icon={<Activity className="w-4 h-4" />}
            isPercentage
          />
          <SecondaryCard
            title="Avg Time"
            value={metrics.avgTime}
            icon={<Clock className="w-4 h-4" />}
            isTime
          />
        </div>
      </div>

      {/* Insufficient Data Notice */}
      {metrics.insufficientData > 0 && (
        <Link
          href={`${baseFilterUrl}INSUFFICIENT_DATA`}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
        >
          <HelpCircle className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {metrics.insufficientData.toLocaleString()} questions with insufficient data
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              These questions have fewer than 50 attempts and cannot generate meaningful analytics.
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default function IntelligenceDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading Intelligence Dashboard…</p>
          </div>
        </div>
      }
    >
      <IntelligenceContent />
    </Suspense>
  );
}
