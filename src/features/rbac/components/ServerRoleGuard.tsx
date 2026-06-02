import { auth } from "@/auth";
import { ROLES, type Role } from "@/features/rbac/services/roles";
import { hasMinimumRole, hasRole } from "@/features/rbac/services/hierarchy";

interface ServerRoleGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  minimumRole?: Role;
  fallback?: React.ReactNode;
}

export async function ServerRoleGuard({
  children,
  requiredRole,
  minimumRole,
  fallback = null,
}: ServerRoleGuardProps) {
  const session = await auth();

  if (!session?.user) {
    return <>{fallback}</>;
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
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export async function ServerModeratorOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ServerRoleGuard minimumRole={ROLES.MODERATOR} fallback={fallback}>
      {children}
    </ServerRoleGuard>
  );
}

export async function ServerAdminOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ServerRoleGuard minimumRole={ROLES.ADMIN} fallback={fallback}>
      {children}
    </ServerRoleGuard>
  );
}

export async function ServerSuperAdminOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ServerRoleGuard requiredRole={ROLES.SUPER_ADMIN} fallback={fallback}>
      {children}
    </ServerRoleGuard>
  );
}

export async function getServerUserRole(): Promise<Role> {
  const session = await auth();
  return (session?.user?.role as Role) ?? ROLES.USER;
}

export async function getServerUserRoleLevel(): Promise<number> {
  const role = await getServerUserRole();
  const hierarchy: Record<Role, number> = {
    [ROLES.USER]: 0,
    [ROLES.MODERATOR]: 1,
    [ROLES.ADMIN]: 2,
    [ROLES.SUPER_ADMIN]: 3,
  };
  return hierarchy[role] ?? 0;
}

export async function isServerUserAtLeast(role: Role): Promise<boolean> {
  const userRole = await getServerUserRole();
  return hasMinimumRole(userRole, role);
}

export async function isServerUserExactly(role: Role): Promise<boolean> {
  const userRole = await getServerUserRole();
  return hasRole(userRole, role);
}

export async function getServerUserPermissions(): Promise<string[]> {
  const session = await auth();
  const role = (session?.user?.role as Role) ?? ROLES.USER;

  const permissionMap: Record<Role, string[]> = {
    [ROLES.USER]: ["quizzes.attempt", "dashboard.access", "profile.manage", "analytics.access"],
    [ROLES.MODERATOR]: [
      "quizzes.attempt",
      "dashboard.access",
      "profile.manage",
      "analytics.access",
      "challenges.create",
      "questions.manage",
      "explanations.edit",
      "content.publish",
    ],
    [ROLES.ADMIN]: [
      "quizzes.attempt",
      "dashboard.access",
      "profile.manage",
      "analytics.access",
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
      "quizzes.attempt",
      "dashboard.access",
      "profile.manage",
      "analytics.access",
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

  return permissionMap[role] ?? [];
}
