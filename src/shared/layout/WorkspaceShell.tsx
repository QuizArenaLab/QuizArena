"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ComponentRegistry } from "@/registry";
import { NavigationRegistry } from "@/navigation";
import { ROLES } from "@/features/rbac/services/roles";
import { Header } from "@/components/layout";
import { ResponsiveSidebar } from "@/components/navigation";
import { NavigationProvider } from "@/providers/NavigationProvider";
import { useLayout } from "@/providers/LayoutProvider";
import { useWorkspace } from "@/providers/WorkspaceProvider";

interface WorkspaceShellProps {
  children: React.ReactNode;
  freshUser?: {
    name: string | null;
    image: string | null;
    username: string | null;
    examCategory: string | null;
  } | null;
  userStatsNode?: React.ReactNode;
}

export function WorkspaceShell({ children, freshUser, userStatsNode }: WorkspaceShellProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { isSidebarCollapsed, responsiveState } = useLayout();
  const { setMetadata } = useWorkspace();

  const user = session?.user;
  const role = (user?.role as string) ?? ROLES.USER;
  const isNotAdmin = role !== ROLES.ADMIN && role !== ROLES.SUPER_ADMIN;

  // Resolve workspace navigation based on role
  // This can be enhanced later to use actual workspace IDs if users belong to multiple workspaces
  let workspaceKey = "user";
  if (role === ROLES.SUPER_ADMIN) workspaceKey = "super-admin";
  else if (role === ROLES.ADMIN) workspaceKey = "admin";
  else if (role === ROLES.MODERATOR) workspaceKey = "moderator";

  // Update global workspace context
  useEffect(() => {
    setMetadata({ id: workspaceKey, name: workspaceKey });
  }, [workspaceKey, setMetadata]);

  // The new NavigationRegistry uses a global manifest list.
  // We resolve the tree based on the user's role.
  const permissionMap: Record<string, string> = {
    USER: "user",
    MODERATOR: "moderator",
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin",
  };
  const permission = permissionMap[role] || "user";
  const resolvedGroups = NavigationRegistry.resolveTree([permission]);

  let settingsHref = "/settings";
  if (role === ROLES.ADMIN) {
    settingsHref = "/dashboard/admin/settings";
  } else if (role === ROLES.SUPER_ADMIN) {
    settingsHref = "/dashboard/super-admin/settings";
  }

  const mergedUser = {
    ...user,
    name: freshUser?.name !== undefined ? freshUser.name : user?.name,
    image: freshUser?.image !== undefined ? freshUser.image : user?.image,
    username: freshUser?.username !== undefined ? freshUser.username : user?.username,
    examCategory:
      freshUser?.examCategory !== undefined ? freshUser.examCategory : (user as any)?.examCategory,
    role,
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return "Super Admin";
      case ROLES.ADMIN:
        return "Admin";
      case ROLES.MODERATOR:
        return "Moderator";
      default:
        return undefined;
    }
  };

  // ── Super Admin Isolation flag ─────────────────────────────────────────
  const isSuperAdminRoute = pathname.startsWith("/dashboard/super-admin");

  // Client-side hard safety redirect guard for unmatched path patterns
  useEffect(() => {
    if (status === "authenticated" && isNotAdmin) {
      const isTargetingAdminRoute =
        pathname.startsWith("/dashboard/admin") ||
        pathname.startsWith("/dashboard/super-admin") ||
        pathname.startsWith("/admin/");
      if (isTargetingAdminRoute) {
        window.location.href = "/dashboard/home";
      }
    }
  }, [pathname, isNotAdmin, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Super Admin Isolation: render bypass after all hooks ────────────────
  if (isSuperAdminRoute) {
    return <>{children}</>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to access the dashboard</p>
          <a href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Header user={mergedUser} />

        <ResponsiveSidebar
          groups={resolvedGroups}
          currentRoute={pathname}
          headerNode={null}
          footerNode={null}
        />

        <main
          className={`flex-1 flex flex-col transition-[margin] duration-220 ease-out ${
            responsiveState === "desktop" ? (isSidebarCollapsed ? "ml-20" : "ml-[280px]") : "ml-0"
          }`}
        >
          <div className="flex-1 w-full px-4 md:px-8 py-6 md:py-8 flex flex-col">{children}</div>
        </main>
      </div>
    </NavigationProvider>
  );
}

ComponentRegistry.register({
  id: "layout-workspace-shell",
  name: "WorkspaceShell",
  category: "layout",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
