/**
 * QuizArena — Super Admin Intelligence Center
 *
 * Server Component entry point for the Strategic Intelligence Dashboard.
 * Access: SUPER_ADMIN ONLY.
 */
import { getStrategicIntelligence } from "@/features/analytics/services/intelligence";
import { IntelligenceDashboardClient } from "@/features/analytics/components/intelligence/IntelligenceDashboardClient";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Strategic Intelligence — QuizArena Super Admin",
  description: "Advanced operational, infrastructure, and strategic insights.",
};

export const dynamic = "force-dynamic";

export default async function SuperAdminIntelligencePage() {
  const { success, data, error } = await getStrategicIntelligence();

  if (!success || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold">Error Loading Strategic Intelligence</h3>
            <p className="text-sm mt-1">
              {error || "Failed to load strategic intelligence. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Serialize dates for client transfer
  const serializedData = JSON.parse(JSON.stringify(data));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <IntelligenceDashboardClient initialData={serializedData} isStrategic={true} />
    </div>
  );
}
