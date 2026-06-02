"use client";

import { useMemo } from "react";
import { PieChart, Activity, BookOpen, Layers } from "lucide-react";

export default function BalancingMetrics({ challenge }: { challenge: any }) {
  const stats = useMemo(() => {
    const questions = challenge.questions.map((cq: any) => cq.question);
    const total = questions.length;

    const diffs: Record<string, number> = {};
    const categories: Record<string, number> = {};
    const subjects: Record<string, number> = {};

    questions.forEach((q: any) => {
      diffs[q.difficulty] = (diffs[q.difficulty] || 0) + 1;
      const cat = q.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
      const sub = q.subject || "No Subject";
      subjects[sub] = (subjects[sub] || 0) + 1;
    });

    return { total, diffs, categories, subjects };
  }, [challenge.questions]);

  if (stats.total === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground">
        Add questions to see balancing metrics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Balancing Engine</h2>
        <p className="text-sm text-muted-foreground">
          Deterministic visibility into challenge composition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Difficulty Distribution */}
        <div className="border rounded-lg p-5 bg-card shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Difficulty</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.diffs).map(([diff, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              return (
                <div key={diff} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{diff}</span>
                    <span className="text-muted-foreground">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="border rounded-lg p-5 bg-card shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Categories</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.categories).map(([cat, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{cat}</span>
                    <span className="text-muted-foreground">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="border rounded-lg p-5 bg-card shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Subjects</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.subjects).map(([sub, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              return (
                <div key={sub} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{sub}</span>
                    <span className="text-muted-foreground">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
