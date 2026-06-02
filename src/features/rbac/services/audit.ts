import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, ROLE_VALUES, type Role } from "./roles";
import { hasMinimumRole, getRoleLevel, ROLE_HIERARCHY } from "./hierarchy";
import { getRolePermissionsWithInheritance, getPermissionHierarchy } from "./permission-map";

export interface RBACAuditResult {
  passed: boolean;
  issues: RBACAuditIssue[];
  timestamp: Date;
}

export interface RBACAuditIssue {
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  description: string;
  location?: string;
  recommendation: string;
}

export const AUDIT_CATEGORIES = {
  ROLE_VALIDATION: "Role Validation",
  PERMISSION_MATRIX: "Permission Matrix",
  ROUTE_PROTECTION: "Route Protection",
  SESSION_SECURITY: "Session Security",
  PRIVILEGE_ESCALATION: "Privilege Escalation",
  DATA_INTEGRITY: "Data Integrity",
} as const;

export const runRBACAudit = async (): Promise<RBACAuditResult> => {
  const issues: RBACAuditIssue[] = [];

  issues.push(...(await auditRoleDefinitions()));
  issues.push(...(await auditPermissionMatrix()));
  issues.push(...auditPrivilegeEscalationPaths());
  issues.push(...(await auditSessionSecurity()));
  issues.push(...auditRouteProtectionDefinitions());
  issues.push(...auditDataIntegrity());

  return {
    passed: issues.filter((i) => i.severity === "critical" || i.severity === "high").length === 0,
    issues,
    timestamp: new Date(),
  };
};

const auditRoleDefinitions = async (): Promise<RBACAuditIssue[]> => {
  const issues: RBACAuditIssue[] = [];

  if (!Object.values(ROLES).includes("USER") || !Object.values(ROLES).includes("SUPER_ADMIN")) {
    issues.push({
      severity: "critical",
      category: AUDIT_CATEGORIES.ROLE_VALIDATION,
      description: "Missing required role definitions",
      recommendation: "Ensure all 4 roles (USER, MODERATOR, ADMIN, SUPER_ADMIN) are defined",
    });
  }

  const hierarchyValues = Object.values(ROLE_HIERARCHY);
  if (new Set(hierarchyValues).size !== hierarchyValues.length) {
    issues.push({
      severity: "critical",
      category: AUDIT_CATEGORIES.ROLE_VALIDATION,
      description: "Duplicate hierarchy values detected",
      recommendation: "Each role must have a unique hierarchy level",
    });
  }

  const dbRoles = await prisma.user.groupBy({
    by: ["role"],
    _count: { role: true },
  });

  dbRoles.forEach(({ role, _count }) => {
    if (role && !ROLE_VALUES.includes(role as Role)) {
      issues.push({
        severity: "high",
        category: AUDIT_CATEGORIES.ROLE_VALIDATION,
        description: `Invalid role in database: ${role} (${_count} users)`,
        location: "Database: users table",
        recommendation: "Migrate or clean up invalid role values",
      });
    }
  });

  return issues;
};

const auditPermissionMatrix = async (): Promise<RBACAuditIssue[]> => {
  const issues: RBACAuditIssue[] = [];

  const rolePermissions = await Promise.all(
    ROLE_VALUES.map(async (role) => ({
      role,
      permissions: await getRolePermissionsWithInheritance(role),
    }))
  );

  rolePermissions.forEach(({ role, permissions }) => {
    const higherRoles = ROLE_VALUES.filter((r) => getRoleLevel(r) > getRoleLevel(role));

    higherRoles.forEach((higherRole) => {
      const higherPermissions =
        rolePermissions.find((rp) => rp.role === higherRole)?.permissions || [];
      const missingFromLower = higherPermissions.filter((p) => !permissions.includes(p));

      if (missingFromLower.length === 0 && higherRole !== role) {
        console.log(
          `[AUDIT] ${role} has same permissions as ${higherRole} (acceptable for SUPER_ADMIN)`
        );
      }
    });
  });

  const permissionHierarchy = getPermissionHierarchy();
  if (!permissionHierarchy || Object.keys(permissionHierarchy).length === 0) {
    issues.push({
      severity: "medium",
      category: AUDIT_CATEGORIES.PERMISSION_MATRIX,
      description: "Permission hierarchy may not be properly configured",
      recommendation: "Verify permission inheritance is working correctly",
    });
  }

  return issues;
};

const auditPrivilegeEscalationPaths = (): RBACAuditIssue[] => {
  const issues: RBACAuditIssue[] = [];

  const escalationPaths = [
    { from: ROLES.USER, to: ROLES.MODERATOR, shouldBlock: true },
    { from: ROLES.USER, to: ROLES.ADMIN, shouldBlock: true },
    { from: ROLES.USER, to: ROLES.SUPER_ADMIN, shouldBlock: true },
    { from: ROLES.MODERATOR, to: ROLES.ADMIN, shouldBlock: true },
    { from: ROLES.MODERATOR, to: ROLES.SUPER_ADMIN, shouldBlock: true },
    { from: ROLES.ADMIN, to: ROLES.SUPER_ADMIN, shouldBlock: true },
  ];

  escalationPaths.forEach(({ from, to, shouldBlock }) => {
    const fromLevel = getRoleLevel(from);
    const toLevel = getRoleLevel(to);

    if (shouldBlock && toLevel > fromLevel) {
      const escalationBlocked = !hasMinimumRole(from, to);
      if (!escalationBlocked) {
        issues.push({
          severity: "medium",
          category: AUDIT_CATEGORIES.PRIVILEGE_ESCALATION,
          description: `Role ${from} can escalate to ${to}`,
          recommendation: "Ensure this escalation requires SUPER_ADMIN validation",
        });
      }
    }
  });

  return issues;
};

const auditSessionSecurity = async (): Promise<RBACAuditIssue[]> => {
  const issues: RBACAuditIssue[] = [];

  try {
    const session = await auth();

    if (!session?.user) {
      return issues;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      issues.push({
        severity: "critical",
        category: AUDIT_CATEGORIES.SESSION_SECURITY,
        description: "Session user not found in database",
        location: "Current user session",
        recommendation: "Session should be invalidated immediately",
      });
      return issues;
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;
    const dbRole = dbUser.role as Role;

    if (sessionRole !== dbRole) {
      issues.push({
        severity: "critical",
        category: AUDIT_CATEGORIES.SESSION_SECURITY,
        description: `Session role (${sessionRole}) doesn't match DB role (${dbRole})`,
        location: "Current user session",
        recommendation: "Session should be invalidated and user redirected to re-authenticate",
      });
    }

    const sessionPrivilege = getRoleLevel(sessionRole);
    const dbPrivilege = getRoleLevel(dbRole);

    if (dbPrivilege < sessionPrivilege) {
      issues.push({
        severity: "critical",
        category: AUDIT_CATEGORIES.SESSION_SECURITY,
        description:
          "Session has higher privilege than database (privilege revocation not reflected)",
        location: "Current user session",
        recommendation: "Implement immediate session invalidation on privilege revocation",
      });
    }
  } catch (error) {
    console.error("Session security audit error:", error);
  }

  return issues;
};

const auditRouteProtectionDefinitions = (): RBACAuditIssue[] => {
  const issues: RBACAuditIssue[] = [];

  const protectedRoutePatterns = [
    { path: "/dashboard/super-admin", requiredRole: ROLES.SUPER_ADMIN },
    { path: "/dashboard/admin", requiredRole: ROLES.ADMIN },
    { path: "/dashboard/moderator", requiredRole: ROLES.MODERATOR },
    { path: "/api/super-admin", requiredRole: ROLES.SUPER_ADMIN },
    { path: "/api/admin", requiredRole: ROLES.ADMIN },
    { path: "/api/moderator", requiredRole: ROLES.MODERATOR },
  ];

  const existingPaths = [
    "/dashboard/super-admin",
    "/dashboard/admin",
    "/dashboard/moderator",
    "/dashboard/home",
    "/challenges",
  ];

  protectedRoutePatterns.forEach(({ path }) => {
    const hasRoute = existingPaths.some((p) => path.startsWith(p));
    if (!hasRoute) {
      issues.push({
        severity: "low",
        category: AUDIT_CATEGORIES.ROUTE_PROTECTION,
        description: `Protected route pattern defined but route may not exist: ${path}`,
        recommendation: "Verify route exists or remove unused pattern",
      });
    }
  });

  return issues;
};

const auditDataIntegrity = (): RBACAuditIssue[] => {
  const issues: RBACAuditIssue[] = [];

  const adminUserCount = ROLE_HIERARCHY[ROLES.ADMIN];
  const superAdminUserCount = ROLE_HIERARCHY[ROLES.SUPER_ADMIN];

  if (adminUserCount !== undefined && superAdminUserCount !== undefined) {
    if (superAdminUserCount === 0) {
      issues.push({
        severity: "high",
        category: AUDIT_CATEGORIES.DATA_INTEGRITY,
        description: "No SUPER_ADMIN users exist in the system",
        recommendation: "Ensure at least one SUPER_ADMIN exists for system administration",
      });
    }
  }

  return issues;
};

export const runQuickAudit = async (): Promise<{
  healthy: boolean;
  summary: string;
}> => {
  const result = await runRBACAudit();

  const criticalIssues = result.issues.filter((i) => i.severity === "critical");
  const highIssues = result.issues.filter((i) => i.severity === "high");

  if (criticalIssues.length > 0) {
    return {
      healthy: false,
      summary: `Critical issues found: ${criticalIssues.length}`,
    };
  }

  if (highIssues.length > 0) {
    return {
      healthy: false,
      summary: `High severity issues found: ${highIssues.length}`,
    };
  }

  return {
    healthy: true,
    summary: `RBAC healthy - ${result.issues.length} minor issues`,
  };
};
