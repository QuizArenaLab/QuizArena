import React from "react";
import { getOperationsDashboardMetrics, getOperationalIssues } from "@/features/admin/services/questions/operations/service";
import { OperationsCenterClient } from "@/features/admin/components/question-bank/operations/OperationsCenterClient";

export const metadata = {
  title: "Question Operations Center | QuizArena",
  description: "Actionable operational queue for question bank maintenance.",
};

export default async function OperationsCenterPage() {
  const [metrics, { issues }] = await Promise.all([
    getOperationsDashboardMetrics(),
    getOperationalIssues({ take: 50 })
  ]);

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <OperationsCenterClient initialMetrics={metrics} initialIssues={issues} />
    </div>
  );
}
