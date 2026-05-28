import { requireAdmin } from "@/lib/rbac/guards";
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
import { ROUTES } from "@/lib/routes";

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard/admin" className="text-xl font-bold text-[#0A1C40]">
                QuizArena Admin
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
