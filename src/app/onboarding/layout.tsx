"use client";

/**
 * QuizArena — Onboarding Infrastructure
 *
 * Onboarding gate pages and layout.
 *
 * NOTE: Full onboarding UI will be implemented in Phase 5.
 * This phase establishes the routing infrastructure only.
 */

import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import Image from "next/image";

/**
 * Onboarding Layout — wraps all onboarding steps
 * Prevents access if onboarding is already complete
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>
    );
  }

  if (status === "unauthenticated") {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // If onboarding is already complete, redirect to dashboard
  if (session?.user?.onboardingCompleted) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  // Simple step indicator logic
  const getStepNumber = () => {
    if (pathname.includes("/complete")) return "3";
    if (pathname.includes("/verify")) return "2";
    return "1";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal onboarding navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-header.png"
              alt="QuizArena"
              width={100}
              height={20}
              className="h-5 w-auto object-contain"
            />
            <span className="text-navy font-bold text-sm hidden sm:inline">Onboarding</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    Number(getStepNumber()) >= step ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Step {getStepNumber()} of 3
            </span>
          </div>
        </div>
      </header>

      {/* Onboarding Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">{children}</main>
    </div>
  );
}
