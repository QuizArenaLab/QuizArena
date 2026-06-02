export const dynamic = "force-dynamic";

import { getLiveOperationsDashboardData } from "@/features/admin/services/live-operations";
import { LiveOperationsDashboardClient } from "@/features/admin/components/live-operations/LiveOperationsDashboardClient";

export const metadata = {
  title: "Live Operations Governance — QuizArena Super Admin",
  description: "Real-time challenge monitoring and operational governance center.",
};

export default async function SuperAdminLiveOpsPage() {
  const data = await getLiveOperationsDashboardData();

  // Serialize dates for client
  const serializedData = JSON.parse(JSON.stringify(data));

  return <LiveOperationsDashboardClient initialData={serializedData} isSuperAdmin={true} />;
}
