"use client";

import Link from "next/link";
import { Menu, X, Layout, BarChart3, User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Session } from "next-auth";

/**
 * Mobile Navigation Drawer — Authenticated State
 * Slide-out menu for mobile with session-aware links
 */
import { usePathname } from "next/navigation";

export function MobileNav({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith("/onboarding");
  const isAuthPage =
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/signup");

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Layout },
    { label: "Challenges", href: "/challenges", icon: BarChart3 },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const toggleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  const initials = session?.user?.name
    ? session.user.name
        .trim()
        .split(/\s+/)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (isOnboarding || isAuthPage) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleOpen}
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                {session ? (
                  <div className="flex items-center gap-3">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User profile"}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Image
                        src="/logo-header.png"
                        alt="QuizArena"
                        width={20}
                        height={20}
                        className="h-5 w-auto"
                      />
                    </div>
                    <span className="font-bold text-navy">QuizArena</span>
                  </div>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {session ? (
                  NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy rounded-lg transition-colors text-sm font-medium"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Home
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </nav>

              {/* Logout Section */}
              {session && (
                <div className="border-t border-gray-100 p-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
