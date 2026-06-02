"use client";

import { useState } from "react";
import {
  SimpleLineChart,
  SimpleBarChart,
  ProgressRing,
  MetricCard,
} from "@/features/analytics/components/Charts";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";
import clsx from "clsx";

interface ChallengeInfo {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  difficulty: string;
}

interface AnalyticsData {
  overview: {
    totalChallenges: number;
    publishedChallenges: number;
    totalAttempts: number;
    completedAttempts: number;
    uniqueParticipants: number;
    averageScore: number;
    averageCompletionTime: number;
    completionRate: number;
  };
  challengeMetrics: {
    overall: {
      totalAttempts: number;
      averageScore: number;
      highestScore: number;
      lowestScore: number;
      averageTime: number;
    };
    topPerforming: Array<{
      challenge: ChallengeInfo | null;
      metrics: {
        totalAttempts: number;
        averageScore: number;
        highestScore: number;
        averageTime: number;
      };
    }>;
    needsAttention: Array<{
      challenge: ChallengeInfo | null;
      totalAttempts: number;
      incompleteAttempts: number;
    }>;
  };
  questionAnalytics: {
    questions: Array<{
      question: {
        id: string;
        question: string;
        subject: string | null;
        topic: string | null;
        difficulty: string;
        marks: number;
      };
      analytics: {
        totalAttempts: number;
        correctAttempts: number;
        wrongAttempts: number;
        skippedAttempts: number;
        accuracyRate: number;
        skipRate: number;
      };
    }>;
    difficultQuestions: Array<{
      question: { id: string; question: string; difficulty: string };
      analytics: { accuracyRate: number; totalAttempts: number };
    }>;
    easyQuestions: Array<{
      question: { id: string; question: string; difficulty: string };
      analytics: { accuracyRate: number; totalAttempts: number };
    }>;
    highSkipRate: Array<{
      question: { id: string; question: string; topic: string | null };
      analytics: { skipRate: number; totalAttempts: number };
    }>;
  };
  trends: Array<{ date: string; value: number; label: string }>;
  difficultyInsights: Array<{ difficulty: string; totalAttempts: number; averageScore: number }>;
  categoryAnalytics: Array<{ category: string; totalAttempts: number; averageScore: number }>;
  insights: Array<{ type: string; message: string; severity: "info" | "warning" | "critical" }>;
}

interface AnalyticsDashboardClientProps {
  data: AnalyticsData;
}

const difficultyColors: Record<string, string> = {
  EASY: "#10b981",
  MEDIUM: "#f59e0b",
  HARD: "#ef4444",
};

const categoryColors: Record<string, string> = {
  SSC: "#6366f1",
  BANKING: "#8b5cf6",
  RAILWAYS: "#ec4899",
  STATE_PSC: "#f59e0b",
};

export function AnalyticsDashboardClient({ data }: AnalyticsDashboardClientProps) {
  const [timeRange, setTimeRange] = useState("monthly");

  const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Analytics Dashboard</h1>
          <p className="text-zinc-500 mt-1">Operational intelligence and performance metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="daily">Last 24 Hours</option>
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {data.insights.length > 0 && (
        <div className="space-y-2">
          {data.insights.map((insight, i) => (
            <div
              key={i}
              className={clsx(
                "flex items-start gap-3 p-4 rounded-lg border",
                insight.severity === "critical" && "bg-red-50 border-red-200 text-red-800",
                insight.severity === "warning" && "bg-amber-50 border-amber-200 text-amber-800",
                insight.severity === "info" && "bg-blue-50 border-blue-200 text-blue-800"
              )}
            >
              {insight.severity === "critical" && <AlertTriangle className="w-5 h-5 mt-0.5" />}
              {insight.severity === "warning" && <Activity className="w-5 h-5 mt-0.5" />}
              {insight.severity === "info" && <CheckCircle className="w-5 h-5 mt-0.5" />}
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Attempts"
          value={data.overview.totalAttempts.toLocaleString()}
          subtitle="Last 30 days"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <MetricCard
          title="Unique Participants"
          value={data.overview.uniqueParticipants.toLocaleString()}
          subtitle="Active users"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="Average Score"
          value={Math.round(data.overview.averageScore)}
          subtitle={`Out of ${data.challengeMetrics.overall.highestScore || 100}`}
          icon={<Target className="w-5 h-5" />}
        />
        <MetricCard
          title="Avg. Completion Time"
          value={formatTime(data.overview.averageCompletionTime)}
          subtitle="Per challenge"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-800">Participation Trends</h2>
          </div>
          {data.trends.length > 0 ? (
            <SimpleLineChart data={data.trends.slice(-14)} color="#6366f1" height={200} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-zinc-400 text-sm">
              No trend data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-800">Difficulty Performance</h2>
          </div>
          {data.difficultyInsights.length > 0 ? (
            <SimpleBarChart
              data={data.difficultyInsights.map((d) => ({
                label: d.difficulty,
                value: d.averageScore,
                color: difficultyColors[d.difficulty] || "#6366f1",
              }))}
              height={180}
            />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-zinc-400 text-sm">
              No difficulty data available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-800">Category Distribution</h2>
          </div>
          {data.categoryAnalytics.length > 0 ? (
            <SimpleBarChart
              data={data.categoryAnalytics.map((c) => ({
                label: c.category,
                value: c.totalAttempts,
                color: categoryColors[c.category] || "#6366f1",
              }))}
              height={160}
              horizontal
            />
          ) : (
            <div className="h-[160px] flex items-center justify-center text-zinc-400 text-sm">
              No category data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">Completion Rate</h2>
          <div className="flex justify-center">
            <ProgressRing
              value={data.overview.completionRate}
              size={140}
              color="#10b981"
              label="Complete"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-zinc-800">{data.overview.completedAttempts}</p>
              <p className="text-xs text-zinc-500">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-800">
                {data.overview.totalAttempts - data.overview.completedAttempts}
              </p>
              <p className="text-xs text-zinc-500">Incomplete</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">Challenge Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-600">Total Challenges</span>
              <span className="font-semibold text-zinc-800">{data.overview.totalChallenges}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-600">Published</span>
              <span className="font-semibold text-emerald-600">
                {data.overview.publishedChallenges}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-600">Avg. Score</span>
              <span className="font-semibold text-zinc-800">
                {Math.round(data.challengeMetrics.overall.averageScore)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-600">Highest Score</span>
              <span className="font-semibold text-zinc-800">
                {data.challengeMetrics.overall.highestScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.challengeMetrics.topPerforming.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">Top Performing Challenges</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-3">
                    Challenge
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-3">
                    Difficulty
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider py-3">
                    Attempts
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider py-3">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.challengeMetrics.topPerforming.map((item, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-3 text-sm text-zinc-800 font-medium truncate max-w-[200px]">
                      {item.challenge?.title || "Unknown"}
                    </td>
                    <td className="py-3 text-sm text-zinc-600">
                      {item.challenge?.category || "-"}
                    </td>
                    <td className="py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${difficultyColors[item.challenge?.difficulty || "MEDIUM"]}15`,
                          color: difficultyColors[item.challenge?.difficulty || "MEDIUM"],
                        }}
                      >
                        {item.challenge?.difficulty || "MEDIUM"}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-zinc-600 text-right">
                      {item.metrics.totalAttempts}
                    </td>
                    <td className="py-3 text-sm text-zinc-800 font-medium text-right">
                      {Math.round(item.metrics.averageScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.questionAnalytics.difficultQuestions.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-zinc-800">Questions Needing Review</h2>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            These questions have low accuracy rates and may need adjustment
          </p>
          <div className="space-y-3">
            {data.questionAnalytics.difficultQuestions.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm text-zinc-800 truncate">{item.question.question}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Difficulty: {item.question.difficulty} • Attempts:{" "}
                    {item.analytics.totalAttempts}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-600">{item.analytics.accuracyRate}%</p>
                  <p className="text-xs text-zinc-500">accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.questionAnalytics.highSkipRate.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">High Skip Rate Questions</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Questions that users frequently skip may be unclear or too difficult
          </p>
          <div className="space-y-3">
            {data.questionAnalytics.highSkipRate.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm text-zinc-800 truncate">{item.question.question}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Topic: {item.question.topic || "General"} • Total:{" "}
                    {item.analytics.totalAttempts}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{item.analytics.skipRate}%</p>
                  <p className="text-xs text-zinc-500">skip rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
