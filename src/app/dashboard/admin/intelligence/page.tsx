/**
 * QuizArena — Admin Intelligence Center
 *
 * Server Component entry point for the Operational Intelligence Dashboard.
 * Access: ADMIN and SUPER_ADMIN.
 */
import { getOperationalIntelligence } from "@/actions/intelligence";
import { IntelligenceDashboardClient } from "@/components/dashboard/intelligence/IntelligenceDashboardClient";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Intelligence Center — QuizArena Admin",
  description: "Operational insights, trends, and workforce intelligence.",
};

export default async function AdminIntelligencePage() {
  const { success, data, error } = await getOperationalIntelligence();

  if (!success || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold">Error Loading Intelligence Center</h3>
            <p className="text-sm mt-1">
              {error || "Failed to load operational intelligence. Please try again later."}
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
      <IntelligenceDashboardClient initialData={serializedData} isStrategic={false} />
    </div>
  );
}
