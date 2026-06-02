"use client";

import type { ModeratorIntelligence, ContentQualityMetrics } from "@/features/analytics/services/intelligence/types";

interface TrendChartsProps {
  moderator: ModeratorIntelligence;
  content: ContentQualityMetrics;
}

export function TrendCharts({ moderator, content }: TrendChartsProps) {
  // We use standard HTML/CSS visualizations to maintain zero-dependency layout
  // for the "TrendCharts" as per requirements, avoiding heavy charting libs unless necessary.

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Moderation Performance */}
      <div className="bg-white rounded-xl border border-border/40 shadow-sm overflow-hidden">
        <div className="p-6 pb-2">
          <h3 className="text-lg font-semibold">Moderator Throughput</h3>
          <p className="text-sm text-muted-foreground">Review activity across the workforce</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {moderator.metrics.length > 0 ? (
              moderator.metrics.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-4">
                      {mod.name}{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        @{mod.username}
                      </span>
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {mod.itemsReviewedLast7Days} reviews
                    </span>
                  </div>

                  {/* Progress Bar visualization */}
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                    {mod.itemsReviewedLast7Days > 0 ? (
                      <>
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${mod.approvalRate}%` }}
                          title={`Approved: ${mod.approvalRate.toFixed(0)}%`}
                        />
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${mod.rejectionRate}%` }}
                          title={`Rejected: ${mod.rejectionRate.toFixed(0)}%`}
                        />
                      </>
                    ) : (
                      <div className="h-full w-full bg-muted-foreground/20" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No moderator activity recorded in the last 7 days.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Quality / Failure Rates */}
      <div className="bg-white rounded-xl border border-border/40 shadow-sm overflow-hidden">
        <div className="p-6 pb-2">
          <h3 className="text-lg font-semibold">Content Anomalies</h3>
          <p className="text-sm text-muted-foreground">
            Categories and challenges with abnormal failure rates
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                High-Failure Challenges
              </h4>
              <div className="space-y-3">
                {content.highFailureChallenges.length > 0 ? (
                  content.highFailureChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-3 rounded-md bg-rose-500/10 border border-rose-500/20"
                    >
                      <div className="truncate pr-4">
                        <p className="text-sm font-medium truncate">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Avg Score: {(challenge.averageScore * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-500 text-white shrink-0">
                        {(challenge.completionRate * 100).toFixed(0)}% completion
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    No critical content anomalies detected.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                Problematic Subjects
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.problematicSubjects.length > 0 ? (
                  content.problematicSubjects.map((sub, i) => (
                    <div key={i} className="p-3 rounded-md border border-border bg-card">
                      <p className="text-sm font-medium truncate">{sub.subject}</p>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-2xl font-bold text-orange-500">
                          {sub.failureRate.toFixed(0)}%
                        </span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          Fail Rate
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-2 col-span-full">
                    No problematic subjects detected.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
