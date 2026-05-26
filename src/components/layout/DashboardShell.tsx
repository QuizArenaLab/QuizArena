"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Menu,
  Target,
  GraduationCap,
  FileText,
  Users,
  Shield,
  Settings2,
  ClipboardList,
  Activity,
  ShieldAlert,
} from "lucide-react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { EXAM_CATEGORY_LABELS, PREPARATION_LEVEL_LABELS } from "@/lib/onboarding";
import { ROLES } from "@/lib/rbac/roles";

interface DashboardShellProps {
  children: React.ReactNode;
}

const userNavItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const moderatorNavItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/manage-challenges", label: "Manage Challenges", icon: Trophy },
  { href: "/dashboard/questions", label: "Question Bank", icon: FileText },
  { href: "/dashboard/content", label: "Content Queue", icon: ClipboardList },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminNavItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/moderators", label: "Moderators", icon: Users },
  { href: "/dashboard/admin/monitoring", label: "Monitoring", icon: Activity },
  { href: "/dashboard/admin/intelligence", label: "Intelligence", icon: BarChart3 },
  { href: "/dashboard/admin/reports", label: "Reports", icon: ShieldAlert },
  { href: "/dashboard/admin/monitoring?tab=trends", label: "Performance", icon: BarChart3 },
  { href: "/dashboard/admin/settings", label: "Platform Settings", icon: Settings2 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const superAdminNavItems = [
  { href: "/dashboard/super-admin/home", label: "Command Center", icon: LayoutDashboard },
  { href: "/dashboard/super-admin/monitoring", label: "Monitoring", icon: Activity },
  { href: "/dashboard/super-admin/intelligence", label: "Intelligence", icon: BarChart3 },
  { href: "/dashboard/super-admin/roles", label: "Role Management", icon: Shield },
  { href: "/dashboard/super-admin/settings", label: "Platform Settings", icon: Settings2 },
];

function getNavItemsForRole(role: string | undefined) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return superAdminNavItems;
    case ROLES.ADMIN:
      return adminNavItems;
    case ROLES.MODERATOR:
      return moderatorNavItems;
    default:
      return userNavItems;
  }
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const user = session?.user;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "quizarenadev@gmail.com";
  const actualRole = (user?.role as string) ?? ROLES.USER;

  // Override the role to USER if the user is not the designated admin, preventing client-side layout leaking.
  const role =
    (actualRole === ROLES.ADMIN || actualRole === ROLES.SUPER_ADMIN) && user?.email !== adminEmail
      ? ROLES.USER
      : actualRole;

  const isNotAdmin = user?.email !== adminEmail;
  const navItems = getNavItemsForRole(role);

  // ── Super Admin Isolation flag ─────────────────────────────────────────
  // Checked after all hooks to avoid Rules of Hooks violation.
  const isSuperAdminRoute = pathname.startsWith("/dashboard/super-admin");
  // ────────────────────────────────────────────────────────────────────────

  // Client-side hard safety redirect guard for unmatched path patterns
  useEffect(() => {
    if (status === "authenticated" && isNotAdmin) {
      const isTargetingAdminRoute =
        pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/super-admin");
      if (isTargetingAdminRoute) {
        window.location.href = "/dashboard/home";
      }
    }
  }, [pathname, isNotAdmin, status]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return "Super Admin";
      case ROLES.ADMIN:
        return "Admin";
      case ROLES.MODERATOR:
        return "Moderator";
      default:
        return "Aspirant";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Super Admin Isolation: render bypass after all hooks ────────────────
  if (isSuperAdminRoute) {
    return <>{children}</>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to access the dashboard</p>
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 text-navy hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-base font-bold text-navy">QuizArena</span>
        <div className="w-8" />
      </header>

      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-30 ${
          collapsed ? "w-[72px]" : "w-[256px]"
        } transition-[width] duration-220 ease-out`}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 shrink-0">
          <Link href="/dashboard/home" className="flex items-center justify-center gap-2.5 w-full">
            <Image
              src={collapsed ? "/logo.png" : "/logo-header.png"}
              alt="QuizArena"
              width={collapsed ? 38 : 140}
              height={collapsed ? 38 : 32}
              className="transition-all duration-220"
              style={{
                width: collapsed ? 38 : 140,
                height: collapsed ? 38 : "auto",
                objectFit: "contain",
              }}
              unoptimized
            />
          </Link>
        </div>

        {/* USER SECTION */}
        <div
          className={`p-4 border-b border-gray-100 shrink-0 ${collapsed ? "flex justify-center" : ""}`}
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {getInitials(user?.name)}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-navy truncate">{user?.name || "User"}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 truncate">
                    @{user?.username || "aspirant"}
                  </span>
                  {role !== ROLES.USER && (
                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                      {getRoleLabel(role)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EXAM CONTEXT */}
        {!collapsed && user?.category && (
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2 p-2.5 bg-primary/5 rounded-lg border border-gray-100/50">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-navy">
                    {EXAM_CATEGORY_LABELS[user.category as keyof typeof EXAM_CATEGORY_LABELS] ||
                      user.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-gray-500">
                    {PREPARATION_LEVEL_LABELS[
                      user.preparationLevel as keyof typeof PREPARATION_LEVEL_LABELS
                    ] || user.preparationLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-220 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                  )}
                  <Icon
                    className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : ""} ${role !== ROLES.USER && item.href.includes("dashboard") ? "text-amber-500" : ""}`}
                  />
                  {!collapsed && (
                    <span className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>
                      {item.label}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-navy text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-navy" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM UTILITY SECTION */}
        <div className="shrink-0 border-t border-gray-100">
          <div className={`p-3 space-y-1 ${collapsed ? "flex justify-center" : ""}`}>
            {collapsed ? (
              <>
                <Link
                  href="/settings"
                  className="flex items-center justify-center p-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-navy transition-all duration-220"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center justify-center p-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-220"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-navy transition-all duration-220 w-full"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-220 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            )}
          </div>

          <div className={`p-3 pt-0 ${collapsed ? "flex justify-center" : ""}`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-navy transition-all duration-220 w-full ${
                collapsed ? "justify-center" : ""
              }`}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[300px] bg-white z-50 shadow-2xl md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo-header.png"
                    alt="QuizArena"
                    width={120}
                    height={28}
                    className="h-7 w-auto"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-navy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile */}
              <div className="px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{user?.name || "User"}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-gray-500">@{user?.username || "aspirant"}</p>
                      {role !== ROLES.USER && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                          {getRoleLabel(role)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Context */}
              {user?.category && (
                <div className="px-5 py-3 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-2 p-2.5 bg-primary/5 rounded-lg border border-gray-100/50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium text-navy">
                          {EXAM_CATEGORY_LABELS[
                            user.category as keyof typeof EXAM_CATEGORY_LABELS
                          ] || user.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-gray-500">
                          {PREPARATION_LEVEL_LABELS[
                            user.preparationLevel as keyof typeof PREPARATION_LEVEL_LABELS
                          ] || user.preparationLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                        )}
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                        <span className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-100 shrink-0 space-y-1">
                <Link
                  href="/settings"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 w-full"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`md:ml-[256px] min-h-[calc(100vh-3.5rem)] md:min-h-screen transition-[margin] duration-220 ease-out ${
          collapsed ? "md:ml-[72px]" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">{children}</div>
      </main>
    </div>
  );
}
