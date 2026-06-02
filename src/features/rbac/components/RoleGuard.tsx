"use client";

import { useSession } from "next-auth/react";
import { ROLES, type Role } from "@/features/rbac/services/roles";
import { hasMinimumRole, hasRole } from "@/features/rbac/services/hierarchy";
import { canPerformAction, type ActionKey } from "@/features/rbac/services/ui-visibility";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  minimumRole?: Role;
  fallback?: React.ReactNode;
  hide?: boolean;
}

export function RoleGuard({
  children,
  requiredRole,
  minimumRole,
  fallback = null,
  hide = false,
}: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    return hide ? null : <>{fallback}</>;
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;

  let authorized = false;

  if (requiredRole) {
    authorized = hasRole(userRole, requiredRole);
  } else if (minimumRole) {
    authorized = hasMinimumRole(userRole, minimumRole);
  } else {
    authorized = true;
  }

  if (!authorized) {
    return hide ? null : <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
  hide?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  fallback = null,
  hide = false,
}: PermissionGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    return hide ? null : <>{fallback}</>;
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  const hasAccess = checkClientPermission(userRole, permission);

  if (!hasAccess) {
    return hide ? null : <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ActionGuardProps {
  children: React.ReactNode;
  action: ActionKey;
  fallback?: React.ReactNode;
  hide?: boolean;
}

export function ActionGuard({ children, action, fallback = null, hide = false }: ActionGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    return hide ? null : <>{fallback}</>;
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  const hasAccess = canPerformAction(userRole, action);

  if (!hasAccess) {
    return hide ? null : <>{fallback}</>;
  }

  return <>{children}</>;
}

const checkClientPermission = (role: Role, permission: string): boolean => {
  const permissionMap: Record<Role, string[]> = {
    [ROLES.USER]: [],
    [ROLES.MODERATOR]: [
      "challenges.create",
      "questions.manage",
      "explanations.edit",
      "content.publish",
    ],
    [ROLES.ADMIN]: [
      "challenges.create",
      "questions.manage",
      "explanations.edit",
      "content.publish",
      "users.moderate",
      "moderators.manage",
      "performance.review",
      "content.approve",
    ],
    [ROLES.SUPER_ADMIN]: [
      "challenges.create",
      "questions.manage",
      "explanations.edit",
      "content.publish",
      "users.moderate",
      "moderators.manage",
      "admins.manage",
      "performance.review",
      "content.approve",
      "financials.manage",
      "platform.settings",
      "admin.create",
    ],
  };

  return permissionMap[role]?.includes(permission) ?? false;
};

export function ModeratorOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard minimumRole={ROLES.MODERATOR} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard minimumRole={ROLES.ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function SuperAdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole={ROLES.SUPER_ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function FinancialAccessOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="financials.manage" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CreateChallengeButton({ children }: { children?: React.ReactNode }) {
  return (
    <ActionGuard action="CREATE_CHALLENGE" hide>
      {children ?? <button>Create Challenge</button>}
    </ActionGuard>
  );
}

export function DeleteButton({ children }: { children?: React.ReactNode }) {
  return (
    <ActionGuard action="DELETE_CHALLENGE" hide>
      {children ?? <button>Delete</button>}
    </ActionGuard>
  );
}

export function BanUserButton({ children }: { children?: React.ReactNode }) {
  return (
    <ActionGuard action="BAN_USER" hide>
      {children ?? <button>Ban User</button>}
    </ActionGuard>
  );
}

export function ManageRolesButton({ children }: { children?: React.ReactNode }) {
  return (
    <ActionGuard action="MANAGE_ROLES" hide>
      {children ?? <button>Manage Roles</button>}
    </ActionGuard>
  );
}
