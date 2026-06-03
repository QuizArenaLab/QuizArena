import { requireMinimumRole } from "@/features/rbac/services/guards";
import { ROLES } from "@/features/rbac/services/roles";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default async function ModeratorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMinimumRole(ROLES.MODERATOR, "/dashboard");

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
