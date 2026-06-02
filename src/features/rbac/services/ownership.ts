import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole } from "./hierarchy";

export type OwnershipType = "CHALLENGE" | "QUESTION" | "USER" | "CATEGORY" | "REPORT" | "PAYMENT";

export interface OwnershipContext {
  resourceType: OwnershipType;
  resourceId: string;
  ownerId: string;
  createdAt?: Date;
}

export interface OwnershipCheckOptions {
  allowAdminOverride?: boolean;
  requireExactOwner?: boolean;
}

export interface OwnershipResult {
  authorized: boolean;
  reason?: string;
}

export const checkOwnership = (
  userId: string,
  userRole: Role,
  context: OwnershipContext,
  options: OwnershipCheckOptions = {}
): OwnershipResult => {
  const { allowAdminOverride = true, requireExactOwner = false } = options;

  if (hasRole(userRole, ROLES.SUPER_ADMIN)) {
    return { authorized: true, reason: "Super admin has full access" };
  }

  if (allowAdminOverride && hasMinimumRole(userRole, ROLES.ADMIN)) {
    return { authorized: true, reason: "Admin override granted" };
  }

  if (context.ownerId === userId) {
    return { authorized: true, reason: "Resource owner" };
  }

  if (requireExactOwner) {
    return { authorized: false, reason: "Exact ownership required" };
  }

  return { authorized: false, reason: "No ownership claim on resource" };
};

export const checkChallengeOwnership = (
  userId: string,
  userRole: Role,
  challengeOwnerId: string,
  options?: OwnershipCheckOptions
): OwnershipResult => {
  return checkOwnership(
    userId,
    userRole,
    {
      resourceType: "CHALLENGE",
      resourceId: "",
      ownerId: challengeOwnerId,
    },
    options
  );
};

export const checkQuestionOwnership = (
  userId: string,
  userRole: Role,
  questionOwnerId: string,
  options?: OwnershipCheckOptions
): OwnershipResult => {
  return checkOwnership(
    userId,
    userRole,
    {
      resourceType: "QUESTION",
      resourceId: "",
      ownerId: questionOwnerId,
    },
    options
  );
};

export const canModerateContent = (
  userRole: Role,
  contentOwnerId: string,
  userId: string
): boolean => {
  if (hasRole(userRole, ROLES.SUPER_ADMIN)) {
    return true;
  }
  if (hasMinimumRole(userRole, ROLES.ADMIN)) {
    return true;
  }
  if (hasRole(userRole, ROLES.MODERATOR)) {
    return contentOwnerId === userId;
  }
  return false;
};

export const canManageUserAccount = (
  requestingUserId: string,
  requestingUserRole: Role,
  targetUserId: string,
  targetUserRole: Role
): boolean => {
  if (hasRole(requestingUserRole, ROLES.SUPER_ADMIN)) {
    return true;
  }

  if (hasRole(requestingUserRole, ROLES.ADMIN)) {
    if (hasRole(targetUserRole, ROLES.SUPER_ADMIN)) {
      return false;
    }
    return true;
  }

  return requestingUserId === targetUserId;
};

export const validateOwnershipForAction = async (
  userId: string,
  userRole: Role,
  resourceType: OwnershipType,
  resourceId: string,
  ownerId: string,
  action: "READ" | "UPDATE" | "DELETE"
): Promise<OwnershipResult> => {
  const result = checkOwnership(userId, userRole, {
    resourceType,
    resourceId,
    ownerId,
  });

  if (!result.authorized) {
    return {
      authorized: false,
      reason: `${action} denied: ${result.reason}`,
    };
  }

  return { authorized: true };
};
