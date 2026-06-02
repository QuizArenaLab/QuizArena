"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import type { Session } from "next-auth";

/**
 * Auth Context State
 */
interface AuthContextType {
  user: Session["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string | null;
  onboardingCompleted: boolean | null;
  checkAccess: (requiredRole?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider — Wraps application with authenticated state
 *
 * Provides:
 * - Real-time auth state
 * - Role-based access checks
 * - Onboarding state
 * - No hydration mismatch
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const user = session?.user ?? null;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const role = user?.role ?? null;
  const onboardingCompleted = user?.onboardingCompleted ?? null;

  /**
   * Check if user has required role/access
   */
  const checkAccess = useCallback(
    (requiredRole?: string): boolean => {
      if (!isAuthenticated) return false;
      if (!requiredRole) return true;
      return role === requiredRole;
    },
    [isAuthenticated, role]
  );

  // Don't render children until hydration is complete to prevent flicker
  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        onboardingCompleted,
        checkAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — Client-side auth hook
 *
 * Usage in client components:
 * ```tsx
 * const { user, isAuthenticated } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * AuthGuard — Redirects unauthenticated users
 *
 * Usage:
 * ```tsx
 * <AuthGuard fallback="/login" />
 * ```
 */
interface AuthGuardProps {
  children: ReactNode;
  fallback?: string;
  requiredRole?: string;
}

export function AuthGuard({
  children,
  fallback = ROUTES.AUTH.SIGN_IN,
  requiredRole,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, checkAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      router.replace(`${fallback}?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (requiredRole && !checkAccess(requiredRole)) {
      router.replace(ROUTES.PROTECTED.DASHBOARD);
    }
  }, [isLoading, isAuthenticated, requiredRole, checkAccess, router, fallback]);

  if (isLoading || !isAuthenticated) {
    return null; // Don't flash unauthenticated content
  }

  if (requiredRole && !checkAccess(requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
