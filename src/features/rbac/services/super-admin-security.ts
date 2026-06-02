import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "./roles";
import { hasRole } from "./hierarchy";

export type AuditEventType =
  | "ROLE_CHANGE"
  | "FINANCIAL_ACCESS"
  | "INFRASTRUCTURE_ACTION"
  | "ADMIN_CREATION"
  | "PERMISSION_ESCALATION"
  | "SENSITIVE_DATA_ACCESS"
  | "PRIVILEGED_ACTION";

export interface AuditEvent {
  type: AuditEventType;
  actorId: string;
  actorRole: Role;
  targetId?: string;
  targetType?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export const AUDIT_EVENT_TYPES: Record<AuditEventType, string> = {
  ROLE_CHANGE: "Role change performed",
  FINANCIAL_ACCESS: "Financial system accessed",
  INFRASTRUCTURE_ACTION: "Infrastructure operation performed",
  ADMIN_CREATION: "Admin account created",
  PERMISSION_ESCALATION: "Permission escalation attempted",
  SENSITIVE_DATA_ACCESS: "Sensitive data accessed",
  PRIVILEGED_ACTION: "Privileged action performed",
};

export const createAuditEvent = async (
  type: AuditEventType,
  details?: Record<string, unknown>
): Promise<AuditEvent | null> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.warn("[AUDIT] Cannot create audit event: No session");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!user) {
      console.warn("[AUDIT] Cannot create audit event: User not found");
      return null;
    }

    const event: AuditEvent = {
      type,
      actorId: session.user.id,
      actorRole: user.role as Role,
      details,
      timestamp: new Date(),
    };

    console.log(`[AUDIT] ${AUDIT_EVENT_TYPES[type]}`, {
      actorId: event.actorId,
      actorRole: event.actorRole,
      ...details,
    });

    return event;
  } catch (error) {
    console.error("[AUDIT] Failed to create audit event:", error);
    return null;
  }
};

export const auditRoleChange = async (
  targetUserId: string,
  oldRole: Role,
  newRole: Role,
  reason?: string
): Promise<void> => {
  await createAuditEvent("ROLE_CHANGE", {
    targetUserId,
    oldRole,
    newRole,
    reason,
  });
};

export const auditFinancialAccess = async (
  action: string,
  details?: Record<string, unknown>
): Promise<void> => {
  await createAuditEvent("FINANCIAL_ACCESS", {
    action,
    ...details,
  });
};

export const auditInfrastructureAction = async (
  action: string,
  details?: Record<string, unknown>
): Promise<void> => {
  await createAuditEvent("INFRASTRUCTURE_ACTION", {
    action,
    ...details,
  });
};

export const auditAdminCreation = async (newAdminId: string, assignedBy: string): Promise<void> => {
  await createAuditEvent("ADMIN_CREATION", {
    newAdminId,
    assignedBy,
  });
};

export const auditPermissionEscalation = async (
  targetUserId: string,
  escalationType: string,
  success: boolean
): Promise<void> => {
  await createAuditEvent("PERMISSION_ESCALATION", {
    targetUserId,
    escalationType,
    success,
  });
};

export const auditPrivilegedAction = async (
  action: string,
  details?: Record<string, unknown>
): Promise<void> => {
  await createAuditEvent("PRIVILEGED_ACTION", {
    action,
    ...details,
  });
};

export interface SessionHardeningConfig {
  enableDBValidation: boolean;
  enableIPValidation: boolean;
  maxSessionAge: number;
  requireReauthForSensitive: boolean;
}

export const DEFAULT_SESSION_HARDENING_CONFIG: SessionHardeningConfig = {
  enableDBValidation: true,
  enableIPValidation: false,
  maxSessionAge: 3600 * 24,
  requireReauthForSensitive: false,
};

export const verifySuperAdminSession = async (
  config: SessionHardeningConfig = DEFAULT_SESSION_HARDENING_CONFIG
): Promise<{ valid: boolean; reason?: string }> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { valid: false, reason: "No session found" };
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;

    if (!hasRole(sessionRole, ROLES.SUPER_ADMIN)) {
      return { valid: false, reason: "Not a Super Admin" };
    }

    if (config.enableDBValidation) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, role: true },
      });

      if (!dbUser) {
        return { valid: false, reason: "User not found in database" };
      }

      const dbRole = dbUser.role as Role;

      if (!hasRole(dbRole, ROLES.SUPER_ADMIN)) {
        return { valid: false, reason: "Super Admin role revoked" };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Session hardening verification failed:", error);
    return { valid: false, reason: "Verification failed" };
  }
};

export const checkPrivilegeRevocation = async (
  userId: string,
  currentRole: Role
): Promise<{ revoked: boolean; newRole?: Role }> => {
  try {
    if (!hasRole(currentRole, ROLES.SUPER_ADMIN)) {
      return { revoked: false };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!dbUser) {
      return { revoked: true, newRole: ROLES.USER };
    }

    const dbRole = dbUser.role as Role;

    if (!hasRole(dbRole, ROLES.SUPER_ADMIN)) {
      return { revoked: true, newRole: dbRole };
    }

    return { revoked: false };
  } catch (error) {
    console.error("Privilege revocation check failed:", error);
    return { revoked: true, newRole: ROLES.USER };
  }
};

export const createSessionRevalidationGuard = () => {
  return async (): Promise<boolean> => {
    const verification = await verifySuperAdminSession({
      enableDBValidation: true,
      enableIPValidation: false,
      maxSessionAge: 3600 * 24,
      requireReauthForSensitive: false,
    });

    return verification.valid;
  };
};

export const superAdminSessionGuard = createSessionRevalidationGuard();
