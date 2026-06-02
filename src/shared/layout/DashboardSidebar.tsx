"use client";

import { useState } from "react";
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
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";

interface DashboardSidebarProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ session, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const user = session?.user;

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 transition-all duration-300 z-30 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* User Section */}
        <div className={`p-4 border-b border-gray-100 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
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
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-navy truncate">{user?.name || "User"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-gray-500 truncate">{user?.username || "Aspirant"}</p>
                  {(user as any)?.examCategory && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary uppercase tracking-wider whitespace-nowrap">
                      {(user as any).examCategory.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? item.label === "Challenges"
                      ? "bg-orange-50 text-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.15)] ring-1 ring-orange-200"
                      : "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? (item.label === "Challenges" ? "text-orange-500 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] scale-110 transition-all" : "text-primary") : ""}`}
                />
                {!collapsed && (
                  <span
                    className={`text-sm font-semibold ${isActive ? (item.label === "Challenges" ? "text-orange-600" : "text-primary") : ""}`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle & Logout */}
        <div
          className={`p-3 border-t border-gray-100 space-y-2 ${collapsed ? "items-center" : ""}`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-navy transition-all w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 md:hidden"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{user?.name || "User"}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-gray-500">{user?.username || "Aspirant"}</p>
                      {(user as any)?.examCategory && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary uppercase tracking-wider whitespace-nowrap">
                          {(user as any).examCategory.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-navy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? item.label === "Challenges"
                            ? "bg-orange-50 text-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.15)] ring-1 ring-orange-200"
                            : "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? (item.label === "Challenges" ? "text-orange-500 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] scale-110 transition-all" : "text-primary") : ""}`}
                      />
                      <span
                        className={`text-sm font-semibold ${isActive ? (item.label === "Challenges" ? "text-orange-600" : "text-primary") : ""}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
