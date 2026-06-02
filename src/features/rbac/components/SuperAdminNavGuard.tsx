"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export const SUPER_ADMIN_NAV_PATHS = [
  "/dashboard/super-admin",
  "/super-admin",
  "/dashboard/platform",
  "/platform",
  "/dashboard/financials",
  "/financials",
  "/dashboard/payouts",
  "/payouts",
  "/dashboard/revenue",
  "/revenue",
  "/dashboard/infrastructure",
  "/infrastructure",
  "/dashboard/roles",
  "/roles",
  "/dashboard/admin-management",
  "/admin-management",
];

export const isSuperAdminPath = (pathname: string): boolean => {
  return SUPER_ADMIN_NAV_PATHS.some((path) => pathname.startsWith(path));
};

interface SuperAdminNavGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuperAdminNavGuard({ children, fallback = null }: SuperAdminNavGuardProps) {
  const pathname = usePathname();
  const isSuperAdminPathResult = useMemo(() => isSuperAdminPath(pathname), [pathname]);

  if (!isSuperAdminPathResult) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface ShowToSuperAdminProps {
  children: React.ReactNode;
  show: boolean;
}

export function ShowToSuperAdmin({ children, show }: ShowToSuperAdminProps) {
  if (!show) {
    return null;
  }
  return <>{children}</>;
}

interface HideFromNonSuperAdminProps {
  children: React.ReactNode;
}

export function HideFromNonSuperAdmin({ children }: HideFromNonSuperAdminProps) {
  return <>{children}</>;
}

export function SuperAdminOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const response = await fetch("/api/auth/check-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setIsVisible(data.role === "SUPER_ADMIN");
      } catch {
        setIsVisible(false);
      }
    };
    checkSuperAdmin();
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/check-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        const role = data.role;
        setIsVisible(role === "ADMIN" || role === "SUPER_ADMIN");
      } catch {
        setIsVisible(false);
      }
    };
    checkAdmin();
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}
