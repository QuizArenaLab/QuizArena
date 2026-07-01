"use client";

import React, { useState, useEffect, useRef } from "react";
import { Monitor, Smartphone, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_MIN_WIDTH } from "@/constants/workspace";

// The legacy workspace actions have been removed in Sprint 0 Architecture Migration.
// We mock this logging function temporarily until Operations Center analytics replaces it.
const logWorkspaceAccessBlock = async (data: any) => {
  console.warn("Workspace access blocked:", data);
};
import { AdminWorkspaceSkeleton } from "./AdminWorkspaceSkeleton";
import { signOut } from "next-auth/react";

interface WorkspaceCapabilities {
  isChecking: boolean;
  isValid: boolean;
  currentWidth: number;
  blockReason: string | null;
}

interface AdminWorkspaceGuardProps {
  children: React.ReactNode;
  userId: string;
  role: string;
}

export function AdminWorkspaceGuard({ children, userId, role }: AdminWorkspaceGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [capabilities, setCapabilities] = useState<WorkspaceCapabilities>({
    isChecking: true,
    isValid: true,
    currentWidth: 0,
    blockReason: null,
  });

  const hasLoggedRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${ADMIN_MIN_WIDTH}px)`);

    const updateCapabilities = (e: MediaQueryList | MediaQueryListEvent) => {
      const isValid = e.matches;
      const currentWidth = window.innerWidth;

      setCapabilities({
        isChecking: false,
        isValid,
        currentWidth,
        blockReason: isValid ? null : "UNSUPPORTED_VIEWPORT",
      });

      if (!isValid && !hasLoggedRef.current) {
        hasLoggedRef.current = true;
        logWorkspaceAccessBlock({
          userId,
          role,
          viewportWidth: currentWidth,
          route: pathname,
        }).catch(console.error);
      } else if (isValid) {
        hasLoggedRef.current = false;
      }
    };

    // Initial check
    updateCapabilities(mediaQuery);

    // Listen for changes (resizes, orientation changes)
    const listener = (e: MediaQueryListEvent) => updateCapabilities(e);

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [pathname, role, userId]);

  if (capabilities.isChecking) {
    return <AdminWorkspaceSkeleton />;
  }

  if (!capabilities.isValid) {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#F8F9FC] text-slate-900 p-6 text-center">
        <div className="mb-8 relative flex items-center justify-center">
          <Monitor className="w-24 h-24 text-slate-300" />
          <Smartphone className="w-12 h-12 text-rose-500 absolute -bottom-2 -right-2 bg-[#F8F9FC] p-1 rounded-lg border-2 border-[#F8F9FC]" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-slate-800">Admin Workspace Unavailable</h1>

        <p className="max-w-md text-slate-500 mb-8 leading-relaxed">
          The QuizArena Administration Console is optimized for desktop workstations to ensure
          accurate moderation, secure operations, and efficient content management.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
