import { getLiveOperationsDashboardData } from "@/features/admin/services/live-operations";
import { LiveOperationsDashboardClient } from "@/features/admin/components/live-operations/LiveOperationsDashboardClient";

export const metadata = {
  title: "Live Operations — QuizArena Admin",
  description: "Real-time challenge monitoring and operational awareness center.",
};

export default async function AdminLiveOpsPage() {
  const data = await getLiveOperationsDashboardData();

  // Serialize dates for client
  const serializedData = JSON.parse(JSON.stringify(data));

  return <LiveOperationsDashboardClient initialData={serializedData} isSuperAdmin={false} />;
}
