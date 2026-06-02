/**
 * QuizArena — Admin Platform Monitoring Page
 *
 * Server Component entry point for the monitoring dashboard.
 * Fetches all monitoring data server-side and passes to the client orchestrator.
 * Access: ADMIN and SUPER_ADMIN only.
 */
import { getMonitoringDashboardData } from "@/features/admin/services/monitoring";
import { MonitoringDashboardClient } from "@/features/admin/components/monitoring/MonitoringDashboardClient";

export const metadata = {
  title: "Platform Monitoring — QuizArena Admin",
  description: "Operational health monitoring and platform reliability center for QuizArena.",
};

export default async function AdminMonitoringPage() {
  const data = await getMonitoringDashboardData();

  // Serialize dates for client transfer
  const serializedData = JSON.parse(JSON.stringify(data));

  return <MonitoringDashboardClient initialData={serializedData} />;
}
