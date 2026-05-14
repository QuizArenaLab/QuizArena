"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

/**
 * Auth State Manager — Client-side authentication state
 *
 * Handles:
 * - Session monitoring
 * - Auth loading states
 * - Session expiry detection
 * - Global logout coordination
 */
export function useAuthState() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Monitor session status changes
  useEffect(() => {
    if (status === "unauthenticated" && !isLoggingOut) {
      // Session expired or invalid — redirect to login
      // Preserve current path for post-login redirect
      const currentPath = window.location.pathname + window.location.search;

      // Basic sanitization: ensure it starts with / and no protocol
      const sanitizePath = (path: string) => {
        if (!path.startsWith("/") || path.includes("://") || path.startsWith("//")) {
          return "/";
        }
        return path;
      };

      if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register")) {
        const safePath = sanitizePath(currentPath);
        router.replace(`/login?callbackUrl=${encodeURIComponent(safePath)}`);
      }
    }
  }, [status, isLoggingOut, router]);

  // Global logout handler
  const handleGlobalLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      setAuthError(null);
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch {
      setAuthError("Failed to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isLoggingOut,
    authError,
    handleGlobalLogout,
    clearAuthError: () => setAuthError(null),
  };
}
