"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  DollarSign,
  Server,
  ShieldAlert,
  Crown,
  ClipboardCheck,
  Sliders,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  Lock,
  Eye,
  Key,
  Rocket,
  LifeBuoy,
  BrainCircuit,
} from "lucide-react";
import { SUPER_ADMIN_PATHS, SUPER_ADMIN_NAV_SECTIONS } from "@/features/super-admin/services/routes";

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  DollarSign,
  Server,
  ShieldAlert,
  Crown,
  ClipboardCheck,
  Sliders,
  Key,
  Rocket,
  LifeBuoy,
  BrainCircuit,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface SuperAdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  userImage?: string | null;
}

// ─── Sidebar Link ─────────────────────────────────────────────────────────────

function SidebarLink({
  href,
  label,
  description,
  iconName,
  isActive,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  description: string;
  iconName: string;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = NAV_ICONS[iconName] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full" />
      )}
      <Icon
        className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}
      />
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className={`text-sm font-medium leading-tight ${isActive ? "text-blue-300" : ""}`}>
            {label}
          </span>
          <span className="text-xs text-slate-600 leading-tight truncate">{description}</span>
        </div>
      )}
      {collapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl">
          <span className="font-semibold text-white">{label}</span>
          <br />
          <span className="text-slate-400 text-xs">{description}</span>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-0 h-0 border-4 border-transparent border-r-slate-700" />
        </div>
      )}
    </Link>
  );
}

// ─── Authority Badge ──────────────────────────────────────────────────────────

function AuthorityBadge({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-1.5 bg-red-950/40 border border-red-800/40 rounded-lg ${collapsed ? "justify-center" : ""}`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
      {!collapsed && (
        <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
          Sovereign
        </span>
      )}
    </div>
  );
}

// ─── Status Indicators ────────────────────────────────────────────────────────

function StatusIndicators({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`space-y-1 ${collapsed ? "flex flex-col items-center gap-1" : ""}`}>
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${collapsed ? "justify-center" : ""}`}
        title="Session Verified"
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
        {!collapsed && <span className="text-[10px] text-slate-500">Session Verified</span>}
      </div>
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${collapsed ? "justify-center" : ""}`}
        title="Security Layer Active"
      >
        <Lock className="w-3 h-3 text-blue-500 shrink-0" />
        {!collapsed && <span className="text-[10px] text-slate-500">Security Layer Active</span>}
      </div>
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${collapsed ? "justify-center" : ""}`}
        title="Audit Enforced"
      >
        <Eye className="w-3 h-3 text-amber-500 shrink-0" />
        {!collapsed && <span className="text-[10px] text-slate-500">Audit Enforced</span>}
      </div>
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export function SuperAdminShell({ children, userEmail, userName }: SuperAdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change — deferred to avoid synchronous setState in effect
  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  const sidebarContent = (isMobile = false) => (
    <div
      className={`flex flex-col h-full bg-[#080D1A] ${isMobile ? "w-[300px]" : ""}`}
      style={{ borderRight: "1px solid rgba(30, 41, 59, 0.8)" }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between h-16 px-4 shrink-0 border-b border-slate-800/60`}
      >
        {!collapsed || isMobile ? (
          <Link href={SUPER_ADMIN_PATHS.HOME} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100 leading-none">QuizArena</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase leading-none mt-0.5">
                Sovereign
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href={SUPER_ADMIN_PATHS.HOME}
            className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-900/30 mx-auto"
          >
            <Shield className="w-4 h-4 text-white" />
          </Link>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Actor Identity */}
      <div
        className={`px-3 py-3 border-b border-slate-800/60 shrink-0 ${collapsed && !isMobile ? "flex justify-center" : ""}`}
      >
        {collapsed && !isMobile ? (
          <div
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs"
            title={userName ?? "Super Admin"}
          >
            {initials}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {userName ?? "Super Admin"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail ?? ""}</p>
            </div>
            <AuthorityBadge collapsed={false} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-1">
          {SUPER_ADMIN_NAV_SECTIONS.map((section) => {
            const isActive = pathname === section.href || pathname.startsWith(section.href + "/");
            return (
              <SidebarLink
                key={section.id}
                href={section.href}
                label={section.label}
                description={section.description}
                iconName={section.icon}
                isActive={isActive}
                collapsed={collapsed && !isMobile}
                onClick={isMobile ? () => setMobileOpen(false) : undefined}
              />
            );
          })}
        </div>

        {/* Settings separator */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-1">
          <SidebarLink
            href={SUPER_ADMIN_PATHS.SETTINGS}
            label="Platform Settings"
            description="Configuration & system settings"
            iconName="Sliders"
            isActive={pathname.startsWith(SUPER_ADMIN_PATHS.SETTINGS)}
            collapsed={collapsed && !isMobile}
          />
        </div>
      </nav>

      {/* Status Indicators */}
      <div className="px-3 py-3 border-t border-slate-800/60 shrink-0">
        <StatusIndicators collapsed={collapsed && !isMobile} />
      </div>

      {/* Footer Actions */}
      <div
        className={`px-2 py-3 border-t border-slate-800/60 shrink-0 space-y-1 ${collapsed && !isMobile ? "flex flex-col items-center" : ""}`}
      >
        {collapsed && !isMobile ? (
          <>
            <Link
              href="/settings"
              className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
              title="General Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-950/40 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all w-full"
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">General Settings</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-950/40 transition-all w-full"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className="px-2 py-2 border-t border-slate-800/60 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800/60 transition-all w-full ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-[#080D1A] border-b border-slate-800/60 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
          aria-label="Open sovereign navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-slate-200">Sovereign Control</span>
        </div>
        <div className="w-8" />
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-30 transition-[width] duration-220 ease-out ${
          collapsed ? "w-[64px]" : "w-[260px]"
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className={`transition-[margin] duration-220 ease-out min-h-screen ${
          collapsed ? "md:ml-[64px]" : "md:ml-[260px]"
        }`}
      >
        {/* Sovereign top bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-[#080D1A]/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
              Super Admin — Sovereign Authority
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-slate-600">DB Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-slate-600">Isolated Layer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-slate-600">All Actions Audited</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
