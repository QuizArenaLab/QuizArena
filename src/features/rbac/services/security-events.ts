import { type Role } from "./roles";
export type SecurityEventType =
  | "PRIVILEGED_ACCESS"
  | "ROLE_CHANGE"
  | "UNAUTHORIZED_ACCESS_ATTEMPT"
  | "PERMISSION_DENIED"
  | "SESSION_INVALIDATION"
  | "ADMIN_ACTION"
  | "MODERATION_ACTION"
  | "FINANCIAL_ACCESS";

export interface SecurityEvent {
  type: SecurityEventType;
  userId: string;
  userRole: Role;
  targetResource?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const shouldLogEvent = (type: SecurityEventType): boolean => {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  const productionEvents: SecurityEventType[] = [
    "ROLE_CHANGE",
    "UNAUTHORIZED_ACCESS_ATTEMPT",
    "SESSION_INVALIDATION",
    "FINANCIAL_ACCESS",
  ];
  return productionEvents.includes(type);
};

export const logSecurityEvent = async (event: Omit<SecurityEvent, "timestamp">): Promise<void> => {
  if (!shouldLogEvent(event.type)) {
    return;
  }

  try {
    const eventData = {
      eventType: event.type,
      userId: event.userId,
      userRole: event.userRole,
      targetResource: event.targetResource ?? "",
      ipAddress: event.ipAddress ?? "",
      userAgent: event.userAgent ?? "",
      metadata: event.metadata ?? {},
    };
    console.log("[SECURITY_EVENT]", JSON.stringify(eventData));
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
};

export const logPrivilegedAccess = async (
  userId: string,
  userRole: Role,
  resource: string,
  options?: { ipAddress?: string; userAgent?: string }
): Promise<void> => {
  await logSecurityEvent({
    type: "PRIVILEGED_ACCESS",
    userId,
    userRole,
    targetResource: resource,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
  });
};

export const logUnauthorizedAttempt = async (
  userId: string,
  userRole: Role,
  attemptedResource: string,
  options?: { ipAddress?: string; userAgent?: string }
): Promise<void> => {
  await logSecurityEvent({
    type: "UNAUTHORIZED_ACCESS_ATTEMPT",
    userId,
    userRole,
    targetResource: attemptedResource,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
  });
};

export const logPermissionDenied = async (
  userId: string,
  userRole: Role,
  requiredPermission: string,
  options?: { ipAddress?: string; userAgent?: string }
): Promise<void> => {
  await logSecurityEvent({
    type: "PERMISSION_DENIED",
    userId,
    userRole,
    targetResource: requiredPermission,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
  });
};

export const logRoleChange = async (
  actorId: string,
  actorRole: Role,
  targetUserId: string,
  oldRole: Role,
  newRole: Role,
  options?: { ipAddress?: string; userAgent?: string }
): Promise<void> => {
  await logSecurityEvent({
    type: "ROLE_CHANGE",
    userId: actorId,
    userRole: actorRole,
    targetResource: `user:${targetUserId}`,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    metadata: {
      targetUserId,
      oldRole,
      newRole,
    },
  });
};

export const getRecentSecurityEvents = async (
  _userId: string,

  _limit: number = 50
): Promise<SecurityEvent[]> => {
  return [];
};
