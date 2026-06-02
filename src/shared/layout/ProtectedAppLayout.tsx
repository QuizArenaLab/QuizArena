/**
 * QuizArena — Protected Dashboard Layout
 *
 * Wraps all authenticated application views with:
 * - Session-verified navbar
 * - Responsive sidebar-like navigation (future)
 * - Consistent page structure
 * - Mobile-safe interactions
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Navbar } from "@/shared/layout/Navbar";
import { MobileNav } from "@/shared/layout/MobileNav";
import { Footer } from "@/shared/layout/Footer";
import { Toaster } from "react-hot-toast";
import type { Session } from "next-auth";

interface ProtectedAppLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export function ProtectedAppLayout({ session, children }: ProtectedAppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/60">
        <Navbar session={session} />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full" id="main-content" role="main" aria-label="Main Content Area">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "12px 20px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation */}
      <MobileNav session={session} />
    </div>
  );
}
