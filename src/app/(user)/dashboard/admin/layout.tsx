import { requireAdmin } from "@/features/rbac/services/guards";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Activity,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin("/dashboard");

  const navItems = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: ROUTES.ADMIN.QUESTION_BANK, label: "Question Bank", icon: BookOpen },
    { href: ROUTES.ADMIN.USERS, label: "Users", icon: Users },
    { href: ROUTES.ADMIN.MODERATORS, label: "Moderators", icon: ClipboardList },
    { href: ROUTES.ADMIN.MONITORING, label: "Monitoring", icon: Activity },
    { href: ROUTES.ADMIN.REPORTS, label: "Reports", icon: ShieldAlert },
    { href: ROUTES.ADMIN.INTELLIGENCE, label: "Intelligence", icon: BarChart3 },
    { href: ROUTES.ADMIN.SETTINGS, label: "Platform Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
