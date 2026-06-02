/**
 * QuizArena — Admin Reports & Abuse Management Page
 *
 * Server Component entry point for the trust & safety dashboard.
 * Fetches all reports data server-side and passes to the client orchestrator.
 * Access: ADMIN and SUPER_ADMIN only.
 */
import { getReportsDashboardData } from "@/features/admin/services/reports";
import { ReportsDashboardClient } from "@/features/admin/components/reports/ReportsDashboardClient";

export const metadata = {
  title: "Reports & Abuse Management — QuizArena Admin",
  description:
    "Centralized trust & safety operations center for investigating reports, managing abuse, and maintaining platform integrity.",
};

export default async function AdminReportsPage() {
  const data = await getReportsDashboardData();

  // Serialize dates for client transfer
  const serializedData = JSON.parse(JSON.stringify(data));

  return <ReportsDashboardClient initialData={serializedData} />;
}
