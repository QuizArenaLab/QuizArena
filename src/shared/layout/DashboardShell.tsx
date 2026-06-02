"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Flame,
} from "lucide-react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { ROLES } from "@/features/rbac/services/roles";
import { AvatarIdentity } from "@/shared/components/AvatarIdentity";
import { logOutAction } from "@/features/user/services/account";

interface DashboardShellProps {
  children: React.ReactNode;
  currentStreak?: number;
  currentRank?: number | null;
  freshUser?: {
    name: string | null;
    image: string | null;
    username: string | null;
    examCategory: string | null;
  } | null;
}

const userNavItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const moderatorNavItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/manage-challenges", label: "Manage Challenges", icon: Trophy },
  { href: "/dashboard/questions", label: "Question Bank", icon: FileText },
  { href: "/dashboard/content", label: "Content Queue", icon: ClipboardList },
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

export function DashboardShell({ children, currentStreak, currentRank, freshUser }: DashboardShellProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const sidebarRef = useRef<HTMLElement>(null);

  const user = session?.user;
  const role = (user?.role as string) ?? ROLES.USER;
  const isNotAdmin = role !== ROLES.ADMIN && role !== ROLES.SUPER_ADMIN;
  const navItems = getNavItemsForRole(role);

  const mergedUser = {
    ...user,
    name: freshUser?.name !== undefined ? freshUser.name : user?.name,
    image: freshUser?.image !== undefined ? freshUser.image : user?.image,
    username: freshUser?.username !== undefined ? freshUser.username : user?.username,
    examCategory: freshUser?.examCategory !== undefined ? freshUser.examCategory : (user as any)?.examCategory,
  };

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
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 group flex flex-col gap-[4.5px] items-start justify-center w-9 h-9 text-navy hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <span className="w-5 h-[2px] bg-current rounded-full transition-all group-hover:w-5"></span>
          <span className="w-3.5 h-[2px] bg-current rounded-full transition-all group-hover:w-5"></span>
          <span className="w-5 h-[2px] bg-current rounded-full transition-all group-hover:w-5"></span>
        </button>
        <Link href="/dashboard/home" className="flex items-center justify-center hover:opacity-80 transition-opacity">
          <Image
            src="/logo-header.png"
            alt="QuizArena"
            width={200}
            height={48}
            className="h-12 w-auto scale-[1.35] sm:scale-[1.4] origin-center object-contain"
            priority
            unoptimized
          />
        </Link>
        <Link href="/profile" className="shrink-0 group hover:opacity-80 transition-opacity mt-1 mr-2">
          <AvatarIdentity
            name={mergedUser?.name}
            username={mergedUser?.username}
            image={mergedUser?.image}
            examCategory={mergedUser?.examCategory}
            rankTier={
              currentRank
                ? currentRank <= 10
                  ? "DIAMOND"
                  : currentRank <= 50
                    ? "GOLD"
                    : currentRank <= 100
                      ? "SILVER"
                      : "BRONZE"
                : "BRONZE"
            }
            size={36}
            className="group-hover:shadow-md transition-all duration-300"
          />
        </Link>
      </header>

      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-30 w-[280px] transition-[width] duration-220 ease-out"
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 shrink-0">
          <Link href="/dashboard/home" className="flex items-center justify-center gap-2.5 w-full">
            <Image
              src="/logo-header.png"
              alt="QuizArena"
              width={160}
              height={36}
              className="transition-all duration-220"
              style={{
                width: 160,
                height: "auto",
                objectFit: "contain",
              }}
              unoptimized
            />
          </Link>
        </div>

        {/* IDENTITY SECTION */}
        <div className="p-5 border-b border-gray-100 shrink-0">
          <Link href="/profile" className="flex items-center gap-4 group transition-all">
            <AvatarIdentity
              name={mergedUser?.name}
              username={mergedUser?.username}
              image={mergedUser?.image}
              examCategory={mergedUser?.examCategory}
              rankTier={
                currentRank
                  ? currentRank <= 10
                    ? "DIAMOND"
                    : currentRank <= 50
                      ? "GOLD"
                      : currentRank <= 100
                        ? "SILVER"
                        : "BRONZE"
                  : "BRONZE"
              }
              size={52}
              className="group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                {mergedUser?.name || "User"}
              </p>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs text-gray-500 truncate">
                  @{mergedUser?.username || "aspirant"}
                </span>
                {role !== ROLES.USER && (
                  <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                    {getRoleLabel(role)}
                  </span>
                )}
              </div>
              {role === ROLES.USER && (
                <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                  <span className="flex items-center whitespace-nowrap gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold border border-orange-100">
                    <Flame className="w-3 h-3 shrink-0" /> {currentStreak || 0} Streak
                  </span>
                  <span className="flex items-center whitespace-nowrap gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100 truncate">
                    <Trophy className="w-3 h-3 shrink-0" /> {currentRank ? `Rank #${currentRank}` : "Unranked"}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={`group relative flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-orange-50 text-orange-600 shadow-[inset_0_2px_12px_rgba(249,115,22,0.06)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                  )}
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-orange-500" : ""} ${!isActive && role !== ROLES.USER && item.href.includes("dashboard") ? "text-amber-500" : ""}`}
                  />
                  <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM UTILITY SECTION */}
        <div className="shrink-0 border-t border-gray-100 mt-auto">
          <div className="p-4 space-y-1">
            <Link
              href="/settings"
              onMouseEnter={() => router.prefetch("/settings")}
              className="group flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-gray-500 hover:bg-gray-50 hover:text-navy transition-all duration-200 w-full"
            >
              <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="group flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-gray-500 hover:bg-red-50/50 hover:text-red-600 transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
              <span className="text-sm font-medium">Sign Out</span>
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
                <Link href="/dashboard/home" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Image
                    src="/logo-header.png"
                    alt="QuizArena"
                    width={160}
                    height={36}
                    className="transition-all duration-220"
                    style={{
                      width: 160,
                      height: "auto",
                      objectFit: "contain",
                    }}
                    unoptimized
                  />
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-navy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile */}
              <div className="px-5 py-5 border-b border-gray-100 shrink-0">
                <Link
                  href="/profile"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 group transition-all"
                >
                  <AvatarIdentity
                    name={mergedUser?.name}
                    username={mergedUser?.username}
                    image={mergedUser?.image}
                    examCategory={mergedUser?.examCategory}
                    rankTier={
                      currentRank
                        ? currentRank <= 10
                          ? "DIAMOND"
                          : currentRank <= 50
                            ? "GOLD"
                            : currentRank <= 100
                              ? "SILVER"
                              : "BRONZE"
                        : "BRONZE"
                    }
                    size={52}
                    className="group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                      {mergedUser?.name || "User"}
                    </p>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs text-gray-500 truncate">
                        @{mergedUser?.username || "aspirant"}
                      </span>
                      {role !== ROLES.USER && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                          {getRoleLabel(role)}
                        </span>
                      )}
                    </div>
                    {role === ROLES.USER && (
                      <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                        <span className="flex items-center whitespace-nowrap gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold border border-orange-100">
                          <Flame className="w-3 h-3 shrink-0" /> {currentStreak || 0} Streak
                        </span>
                        <span className="flex items-center whitespace-nowrap gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100 truncate">
                          <Trophy className="w-3 h-3 shrink-0" />{" "}
                          {currentRank ? `Rank #${currentRank}` : "Unranked"}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

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
                        onMouseEnter={() => router.prefetch(item.href)}
                        className={`group relative flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-orange-50 text-orange-600 shadow-[inset_0_2px_12px_rgba(249,115,22,0.06)]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                        )}
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-orange-500" : ""} ${!isActive && role !== ROLES.USER && item.href.includes("dashboard") ? "text-amber-500" : ""}`}
                        />
                        <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
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
                  onMouseEnter={() => router.prefetch("/settings")}
                  className="group flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-gray-500 hover:bg-gray-50 hover:text-navy transition-all duration-200 w-full"
                >
                  <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setIsSignOutModalOpen(true);
                  }}
                  className="group flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-gray-500 hover:bg-red-50/50 hover:text-red-600 transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden"
            >
              <h3 className="text-lg font-bold text-navy mb-2">Sign Out?</h3>
              <p className="text-sm text-gray-500 mb-6">
                You will need to sign in again to access your account.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsSignOutModalOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        await logOutAction();
                      } catch (err) {
                        // ignore error
                      } finally {
                        signOut({ callbackUrl: "/" });
                      }
                    });
                  }}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isPending ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="md:ml-[280px] min-h-[calc(100vh-3.5rem)] md:min-h-screen transition-[margin] duration-220 ease-out flex flex-col">
        <div className="flex-1 w-full px-4 md:px-8 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
