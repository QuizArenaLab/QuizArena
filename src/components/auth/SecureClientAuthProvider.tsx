/**
 * QuizArena — Client Auth Provider Wrapper
 *
 * Wraps the server AuthProvider with error boundary
 * and loading state management for production-grade UX.
 */
"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { SessionProvider } from "next-auth/react";

/**
 * SecureClientAuthProvider — Production-grade auth wrapping
 *
 * Layers:
 * 1. Session Provider (NextAuth Context)
 * 2. Error boundary (catches auth runtime errors)
 * 3. Auth context (provides application-specific session state)
 */
export function SecureClientAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthErrorBoundary>
        <AuthProvider>{children}</AuthProvider>
      </AuthErrorBoundary>
    </SessionProvider>
  );
}
