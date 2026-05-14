import "@/styles/globals.css";
import { Hanken_Grotesk } from "next/font/google";
import { SecureClientAuthProvider } from "@/components/auth/SecureClientAuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { getServerSession } from "@/lib/session-utils";

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
  // Fetch session on the server to prevent Navbar flicker
  const session = await getServerSession();

  return (
<<<<<<< HEAD
    <html lang="en" className={hanken.variable}>
      <body className="antialiased min-h-screen bg-background font-sans text-navy flex flex-col">
        <SecureClientAuthProvider>
          {/* Global Desktop Navbar */}
          <Navbar session={session} />

          {/* Global Mobile Navigation Drawer */}
          <MobileNav session={session} />

          {/* Main Application Content */}
          <main className="flex-1 w-full">{children}</main>
        </SecureClientAuthProvider>
=======
    <html lang="en" className={`${hankenGrotesk.variable} h-full antialiased relative`}>
      <body className="min-h-full flex flex-col font-sans relative">
        <Navbar />
        {children}
        <Footer />
>>>>>>> wholesale-school
      </body>
    </html>
  );
}
