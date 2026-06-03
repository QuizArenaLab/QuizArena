import React, { Suspense } from "react";
import { Users } from "lucide-react";
import { requireAdmin } from "@/features/rbac/services/guards";
import { fetchUserStats, fetchUserLifecycle } from "@/features/admin/users/services/user-stats";
import { fetchUserDirectory } from "@/features/admin/users/services/user-directory";
import { KPIStats } from "./components/KPIStats";
import { UserManagementDashboard } from "./components/UserManagementDashboard";

interface SearchParams {
  page?: string;
  search?: string;
  filter?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin("/dashboard");

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const filter = params.filter || "all";

  const [stats, lifecycle, directoryData] = await Promise.all([
    fetchUserStats(),
    fetchUserLifecycle(),
    fetchUserDirectory({ page, limit: 20, search, filter }),
  ]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">User Management</h1>
            <p className="text-sm text-gray-500">Platform governance and user operations</p>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <KPIStats stats={stats} lifecycle={lifecycle} />
      </div>

      <div className="flex-1 min-h-[500px]">
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading directory...</div>}>
          <UserManagementDashboard initialData={directoryData} />
        </Suspense>
      </div>
    </div>
  );
}
