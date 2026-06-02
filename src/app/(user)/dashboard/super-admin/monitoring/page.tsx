/**
 * QuizArena — Super Admin Platform Monitoring Page
 *
 * Full monitoring access for super administrators.
 * Uses the same monitoring system as admin, with super-admin RBAC layer.
 */
import { requireSuperAdmin } from "@/features/rbac/services/super-admin";
import { getMonitoringDashboardData } from "@/features/admin/services/monitoring";
import { MonitoringDashboardClient } from "@/features/admin/components/monitoring/MonitoringDashboardClient";

export const metadata = {
  title: "Platform Monitoring — QuizArena Super Admin",
  description:
    "Full operational monitoring and platform reliability center for QuizArena super administrators.",
};

export default async function SuperAdminMonitoringPage() {
  await requireSuperAdmin();

  const data = await getMonitoringDashboardData();
  const serializedData = JSON.parse(JSON.stringify(data));

  return <MonitoringDashboardClient initialData={serializedData} />;
}
