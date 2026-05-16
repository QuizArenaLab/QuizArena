import "@/styles/globals.css";
import { Hanken_Grotesk } from "next/font/google";
import { SecureClientAuthProvider } from "@/components/auth/SecureClientAuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { getServerSession } from "@/lib/session-utils";

import { Footer } from "@/components/layout/Footer";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });

export const metadata = {
  title: "QuizArena — Ace Your Exams with AI",
  description: "Advanced AI-powered quiz platform for competitive exam preparation.",
};

/**
 * QuizArena — Root Layout
 *
 * Provides the foundational HTML structure, global styles,
 * and font configurations for the entire application.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  // We can't use usePathname in a server component easily without headers or a wrapper.
  // However, we can use headers to detect the current path.
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const fullPath = headersList.get("x-invoke-path") || "";
  const isOnboarding = fullPath.startsWith("/onboarding");
  const isHomePage = fullPath === "/";
  const isLoggedIn = !!session;

  return (
    <html lang="en" className={hanken.variable}>
      <body className="antialiased min-h-screen bg-background font-sans text-navy flex flex-col">
        <SecureClientAuthProvider>
          {/* Global Desktop Navbar - Visible only when not logged in */}
          {!isLoggedIn && !isOnboarding && <Navbar session={session} />}

          {/* Global Mobile Navigation Drawer - Visible only when not logged in */}
          {!isLoggedIn && !isOnboarding && <MobileNav session={session} />}

          {/* Main Application Content */}
          <main className={!isOnboarding ? "flex-1 w-full" : "flex-1 w-full"}>{children}</main>

          {/* Global Footer - Visible only when not logged in */}
          {!isLoggedIn && !isOnboarding && <Footer />}
        </SecureClientAuthProvider>
      </body>
    </html>
  );
}
