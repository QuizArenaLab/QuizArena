import "@/shared/styles/globals.css";
import { Hanken_Grotesk } from "next/font/google";
import { SecureClientAuthProvider } from "@/shared/providers/SecureClientAuthProvider";
import { Navbar } from "@/shared/layout/Navbar";
import { MobileNav } from "@/shared/layout/MobileNav";
import { getServerSession } from "@/lib/session-utils";

import { Footer } from "@/shared/layout/Footer";

import { MaintenanceFallback } from '@/shared/error-state/maintenance-fallback';
import { NotificationCenter } from '@/shared/feedback/NotificationCenter';
import { getPlatformState } from "@/features/super-admin/services/infrastructure/platform-controls";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | QuizArena",
    default: "QuizArena — Ace Your Exams with AI",
  },
  description:
    "Advanced AI-powered quiz platform for competitive exam preparation. Build discipline and master concepts.",
  openGraph: {
    title: "QuizArena — Ace Your Exams with AI",
    description: "Advanced AI-powered quiz platform for competitive exam preparation.",
    url: "https://quizarena.com",
    siteName: "QuizArena",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizArena",
    description: "Advanced AI-powered quiz platform for competitive exam preparation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * QuizArena — Root Layout
 *
 * Provides the foundational HTML structure, global styles,
 * and font configurations for the entire application.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  // Infrastructure: Server-authoritative maintenance check
  const platformState = await getPlatformState();
  const userRole = (session?.user?.role as string) || "USER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  if (platformState.maintenanceMode.enabled && !isSuperAdmin) {
    return (
      <html lang="en" className={hanken.variable}>
        <body className="antialiased min-h-screen bg-background font-sans text-navy flex flex-col">
          <MaintenanceFallback message={platformState.maintenanceMode.message} />
        </body>
      </html>
    );
  }

  // We can't use usePathname in a server component easily without headers or a wrapper.
  // However, we can use headers to detect the current path.
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const fullPath = headersList.get("x-invoke-path") || "";
  const isOnboarding = fullPath.startsWith("/onboarding");
  const isAuthPage =
    fullPath.startsWith("/register") ||
    fullPath.startsWith("/login") ||
    fullPath.startsWith("/forgot-password") ||
    fullPath.startsWith("/signup");
  const isLoggedIn = !!session;

  return (
    <html lang="en" className={hanken.variable}>
      <body className="antialiased min-h-screen bg-background font-sans text-navy flex flex-col">
        <SecureClientAuthProvider>
          {/* Global Desktop Navbar - Visible only when not logged in and not on auth pages */}
          {!isLoggedIn && !isOnboarding && !isAuthPage && <Navbar session={session} />}

          {/* Global Mobile Navigation Drawer - Visible only when not logged in and not on auth pages */}
          {!isLoggedIn && !isOnboarding && !isAuthPage && <MobileNav session={session} />}

          {/* Main Application Content */}
          <main className={!isOnboarding ? "flex-1 w-full" : "flex-1 w-full"}>{children}</main>

          {/* Global Footer - Visible only when not logged in and not on auth pages */}
          {!isLoggedIn && !isOnboarding && !isAuthPage && <Footer />}

          {/* Global Notification Center */}
          <NotificationCenter />
        </SecureClientAuthProvider>
      </body>
    </html>
  );
}
