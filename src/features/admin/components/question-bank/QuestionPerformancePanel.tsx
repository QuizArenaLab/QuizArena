"use client";

import { useState } from "react";
import {
  Activity,
  Target,
  Clock,
  BarChart3,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  AlertCircle,
  Zap,
} from "lucide-react";
import type { QuestionIntelligence } from "@/features/admin/services/question-bank/usage-intelligence";

interface Props {
  intelligence: QuestionIntelligence;
  configuredDifficulty: string;
  onDismissRecommendation?: (type: string) => void;
}

type TabId = "overview" | "difficulty" | "timing" | "benchmarks" | "recommendations";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
  { id: "difficulty", label: "Difficulty", icon: <Target className="w-4 h-4" /> },
  { id: "timing", label: "Timing", icon: <Clock className="w-4 h-4" /> },
  { id: "benchmarks", label: "Benchmarks", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "recommendations", label: "Recommendations", icon: <Lightbulb className="w-4 h-4" /> },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "UP") return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "DOWN") return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
}

function TrendArrow({ trend }: { trend: string }) {
  if (trend === "UP") return <span className="text-emerald-600 font-bold">↑</span>;
  if (trend === "DOWN") return <span className="text-rose-600 font-bold">↓</span>;
  return <span className="text-gray-400 font-bold">→</span>;
}

function DataQualityBadge({ quality }: { quality: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    HIGH: { bg: "bg-emerald-50", text: "text-emerald-700", label: "High Quality" },
    MEDIUM: { bg: "bg-blue-50", text: "text-blue-700", label: "Medium Quality" },
    LOW: { bg: "bg-amber-50", text: "text-amber-700", label: "Low Quality" },
    INSUFFICIENT: { bg: "bg-gray-100", text: "text-gray-500", label: "Insufficient Data" },
  };
  const c = config[quality] || config.INSUFFICIENT;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function ConfidenceGauge({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return "from-emerald-500 to-green-500";
    if (s >= 60) return "from-blue-500 to-indigo-500";
    if (s >= 40) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-linear-to-r ${getColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  trend,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        {icon}
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {(sub || trend) && (
        <div className="flex items-center gap-1 mt-1">
          {trend && <TrendIcon trend={trend} />}
          {sub && <span className="text-[11px] text-gray-500">{sub}</span>}
        </div>
      )}
    </div>
  );
}

function FlagBadge({ flag }: { flag: string }) {
  const isPositive = flag === "HEALTHY";
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
        isPositive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
      }`}
    >
      {flag.replace(/_/g, " ")}
    </span>
  );
}

// ─── Tab Content Components ─────────────────────────────────────────────────

function OverviewTab({ intelligence }: { intelligence: QuestionIntelligence }) {
  const { usageStats, dynamicFlags, confidence } = intelligence;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Attempts"
          value={usageStats.timesAttempted.toLocaleString()}
          trend={usageStats.attemptsTrend}
        />
        <MetricCard
          label="Success Rate"
          value={`${(usageStats.successRate * 100).toFixed(1)}%`}
          trend={usageStats.successRateTrend}
          icon={
            usageStats.successRate >= 0.7 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : usageStats.successRate <= 0.3 ? (
              <XCircle className="w-4 h-4 text-rose-400" />
            ) : undefined
          }
        />
        <MetricCard
          label="Skip Rate"
          value={`${usageStats.timesAttempted > 0 ? ((usageStats.skippedAttempts / usageStats.timesAttempted) * 100).toFixed(1) : 0}%`}
          sub={`${usageStats.skippedAttempts} skipped`}
        />
        <MetricCard
          label="Reports"
          value={usageStats.reportCount}
          trend={usageStats.reportsTrend}
          icon={usageStats.reportCount > 3 ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : undefined}
        />
      </div>

      <ConfidenceGauge score={confidence.score} label={confidence.label} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Data Quality
          </p>
          <DataQualityBadge quality={usageStats.dataQuality} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Analytics Version
          </p>
          <span className="text-xs font-mono text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
            v{usageStats.analyticsVersion}
          </span>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Active Flags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {dynamicFlags.map((flag) => (
            <FlagBadge key={flag} flag={flag} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-600">{usageStats.correctAttempts.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Correct</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-rose-600">{usageStats.incorrectAttempts.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Incorrect</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-500">{usageStats.skippedAttempts.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Skipped</p>
        </div>
      </div>
    </div>
  );
}

function DifficultyTab({ intelligence }: { intelligence: QuestionIntelligence }) {
  const { difficulty, trends, usageStats } = intelligence;

  const actualLabel = difficulty.actual?.replace(/_/g, " ") ?? "N/A";
  const driftBadge = difficulty.drift.hasDrift
    ? {
        MINOR: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
        SIGNIFICANT: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
        CRITICAL: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
      }[difficulty.drift.severity!]
    : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
        <div>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
            Configured
          </p>
          <span className="text-sm font-bold px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700">
            {difficulty.configured}
          </span>
        </div>
        <div className="flex items-center px-3">
          {difficulty.drift.hasDrift ? (
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
            Actual (Measured)
          </p>
          <span
            className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${
              difficulty.drift.hasDrift
                ? "bg-orange-50 border-orange-200 text-orange-700"
                : "bg-white border-indigo-200 text-indigo-700"
            }`}
          >
            {actualLabel}
          </span>
        </div>
      </div>

      {difficulty.drift.hasDrift && driftBadge && (
        <div className={`p-4 rounded-xl border ${driftBadge.bg}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 ${driftBadge.text} shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm font-semibold ${driftBadge.text}`}>
                Difficulty Drift — {difficulty.drift.severity}
              </p>
              <p className={`text-sm ${driftBadge.text} opacity-80 mt-0.5`}>
                Question is {difficulty.drift.direction?.replace(/_/g, " ").toLowerCase()}.
                Success rate: {(usageStats.successRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          Usage Trends
        </p>
        <div className="space-y-2">
          {(["short", "medium", "long"] as const).map((window) => (
            <div key={window} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-600">
                {trends.windows[window === "short" ? "SHORT" : window === "medium" ? "MEDIUM" : "LONG"]}d
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>SR</span> <TrendArrow trend={trends[window].successRate} />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Att</span> <TrendArrow trend={trends[window].attempts} />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Rep</span> <TrendArrow trend={trends[window].reports} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimingTab({ intelligence }: { intelligence: QuestionIntelligence }) {
  const { usageStats } = intelligence;
  const isConfusing = usageStats.medianTimeSpent > 0 && usageStats.averageTimeSpent > usageStats.medianTimeSpent * 1.5;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Average Time"
          value={`${usageStats.averageTimeSpent.toFixed(1)}s`}
          icon={<Clock className="w-4 h-4 text-gray-300" />}
        />
        <MetricCard
          label="Median Time"
          value={`${usageStats.medianTimeSpent.toFixed(1)}s`}
          icon={<Clock className="w-4 h-4 text-gray-300" />}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-center">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Fastest</p>
          <p className="text-lg font-bold text-emerald-700">
            {usageStats.fastestTime != null ? `${usageStats.fastestTime}s` : "—"}
          </p>
        </div>
        <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 text-center">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Slowest</p>
          <p className="text-lg font-bold text-rose-700">
            {usageStats.slowestTime != null ? `${usageStats.slowestTime}s` : "—"}
          </p>
        </div>
        <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-center">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">P90</p>
          <p className="text-lg font-bold text-indigo-700">
            {usageStats.p90Time != null ? `${usageStats.p90Time}s` : "—"}
          </p>
        </div>
      </div>

      {isConfusing && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Possible Confusing Question</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Average time ({usageStats.averageTimeSpent.toFixed(1)}s) is significantly higher than median (
              {usageStats.medianTimeSpent.toFixed(1)}s), indicating some users struggle significantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function BenchmarksTab({ intelligence }: { intelligence: QuestionIntelligence }) {
  const { benchmarks } = intelligence;

  if (benchmarks.insufficientData) {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <Info className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-700">
          Insufficient data to generate meaningful benchmarks. Need at least 50 attempts.
        </p>
      </div>
    );
  }

  const benchmarkItems = [
    { data: benchmarks.byTopic, label: "Topic Benchmark" },
    { data: benchmarks.bySubject, label: "Subject Benchmark" },
    { data: benchmarks.byExam, label: "Exam Benchmark" },
  ].filter((b) => b.data !== null);

  if (benchmarkItems.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <Info className="w-5 h-5 text-gray-400 shrink-0" />
        <p className="text-sm text-gray-500">
          No peer data available for benchmarking. Ensure questions share common metadata (topic, subject, exam).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {benchmarkItems.map(({ data, label }) => {
        if (!data) return null;
        const perfConfig = {
          ABOVE_AVERAGE: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", label: "Above Average", icon: <TrendingUp className="w-4 h-4" /> },
          AVERAGE: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: "Average", icon: <Minus className="w-4 h-4" /> },
          BELOW_AVERAGE: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", label: "Below Average", icon: <TrendingDown className="w-4 h-4" /> },
        }[data.performance];

        return (
          <div key={label} className={`p-4 rounded-xl border ${perfConfig.bg} ${perfConfig.border}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{data.scope}</p>
              <div className={`flex items-center gap-1 text-xs font-bold ${perfConfig.text}`}>
                {perfConfig.icon}
                {perfConfig.label}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">This Question</p>
                <p className="text-lg font-bold text-gray-900">{(data.questionSuccessRate * 100).toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                  Peer Avg ({data.peerCount} questions)
                </p>
                <p className="text-lg font-bold text-gray-600">{(data.peerAverage * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecommendationsTab({
  intelligence,
  onDismiss,
}: {
  intelligence: QuestionIntelligence;
  onDismiss?: (type: string) => void;
}) {
  const { recommendations } = intelligence;

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
        <p className="text-sm font-semibold text-gray-700">No Recommendations</p>
        <p className="text-xs text-gray-500 mt-1">This question is performing within expected parameters.</p>
      </div>
    );
  }

  const severityConfig = {
    INFO: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: <Info className="w-5 h-5 text-blue-500" /> },
    WARNING: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
    CRITICAL: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: <Zap className="w-5 h-5 text-rose-500" /> },
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => {
        const config = severityConfig[rec.severity];
        return (
          <div key={rec.type} className={`p-4 rounded-xl border ${config.bg} ${config.border}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{config.icon}</div>
                <div>
                  <p className={`text-sm font-semibold ${config.text}`}>{rec.title}</p>
                  <p className={`text-sm ${config.text} opacity-80 mt-0.5`}>{rec.message}</p>
                </div>
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(rec.type)}
                  className={`px-3 py-1.5 text-xs font-semibold ${config.text} hover:bg-white/50 rounded-md transition-colors ml-3 shrink-0`}
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function QuestionPerformancePanel({
  intelligence,
  configuredDifficulty,
  onDismissRecommendation,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (intelligence.insufficientData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Performance Intelligence
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Live analytics from user behavior</p>
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Insufficient Data</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Need at least 50 attempts to generate intelligence insights. Current attempts:{" "}
              <strong>{intelligence.usageStats.timesAttempted}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Performance Intelligence
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Live analytics from user behavior</p>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-0 -mb-px overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/30"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "recommendations" && intelligence.recommendations.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded-full min-w-[16px] text-center">
                  {intelligence.recommendations.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && <OverviewTab intelligence={intelligence} />}
        {activeTab === "difficulty" && <DifficultyTab intelligence={intelligence} />}
        {activeTab === "timing" && <TimingTab intelligence={intelligence} />}
        {activeTab === "benchmarks" && <BenchmarksTab intelligence={intelligence} />}
        {activeTab === "recommendations" && (
          <RecommendationsTab intelligence={intelligence} onDismiss={onDismissRecommendation} />
        )}
      </div>
    </div>
  );
}
