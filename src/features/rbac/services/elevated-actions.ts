import { ROLES, type Role } from "./roles";
import { hasRole } from "./hierarchy";

export type ElevatedActionType =
  | "FINANCIAL_TRANSFER"
  | "ROLE_ESCALATION"
  | "ADMIN_CREATION"
  | "PERMISSION_GRANT"
  | "DATA_DELETE"
  | "SYSTEM_CONFIG_CHANGE"
  | "BULK_OPERATION"
  | "API_KEY_GENERATION";

export type VerificationLevel = "NONE" | "PASSWORD" | "MFA" | "STEP_UP";

export interface ElevatedActionConfig {
  actionType: ElevatedActionType;
  requiredVerification: VerificationLevel;
  description: string;
  auditLogRequired: boolean;
  additionalConfirmationRequired: boolean;
}

export const ELEVATED_ACTION_CONFIGS: Record<ElevatedActionType, ElevatedActionConfig> = {
  FINANCIAL_TRANSFER: {
    actionType: "FINANCIAL_TRANSFER",
    requiredVerification: "STEP_UP",
    description: "Transfer of funds or payment processing",
    auditLogRequired: true,
    additionalConfirmationRequired: true,
  },
  ROLE_ESCALATION: {
    actionType: "ROLE_ESCALATION",
    requiredVerification: "MFA",
    description: "Promoting user to elevated role (Admin, Moderator, Super Admin)",
    auditLogRequired: true,
    additionalConfirmationRequired: true,
  },
  ADMIN_CREATION: {
    actionType: "ADMIN_CREATION",
    requiredVerification: "MFA",
    description: "Creating new admin or super admin accounts",
    auditLogRequired: true,
    additionalConfirmationRequired: true,
  },
  PERMISSION_GRANT: {
    actionType: "PERMISSION_GRANT",
    requiredVerification: "MFA",
    description: "Granting special permissions to users",
    auditLogRequired: true,
    additionalConfirmationRequired: false,
  },
  DATA_DELETE: {
    actionType: "DATA_DELETE",
    requiredVerification: "PASSWORD",
    description: "Deleting user data or bulk data operations",
    auditLogRequired: true,
    additionalConfirmationRequired: true,
  },
  SYSTEM_CONFIG_CHANGE: {
    actionType: "SYSTEM_CONFIG_CHANGE",
    requiredVerification: "PASSWORD",
    description: "Changing system-wide configuration",
    auditLogRequired: true,
    additionalConfirmationRequired: false,
  },
  BULK_OPERATION: {
    actionType: "BULK_OPERATION",
    requiredVerification: "PASSWORD",
    description: "Bulk user operations or batch processing",
    auditLogRequired: true,
    additionalConfirmationRequired: false,
  },
  API_KEY_GENERATION: {
    actionType: "API_KEY_GENERATION",
    requiredVerification: "PASSWORD",
    description: "Generating API keys for external access",
    auditLogRequired: true,
    additionalConfirmationRequired: false,
  },
};

export const requiresVerification = (actionType: ElevatedActionType): boolean => {
  const config = ELEVATED_ACTION_CONFIGS[actionType];
  return config.requiredVerification !== "NONE";
};

export const getVerificationLevel = (actionType: ElevatedActionType): VerificationLevel => {
  return ELEVATED_ACTION_CONFIGS[actionType].requiredVerification;
};

export const requiresAuditLog = (actionType: ElevatedActionType): boolean => {
  return ELEVATED_ACTION_CONFIGS[actionType].auditLogRequired;
};

export const requiresAdditionalConfirmation = (actionType: ElevatedActionType): boolean => {
  return ELEVATED_ACTION_CONFIGS[actionType].additionalConfirmationRequired;
};

export const getActionDescription = (actionType: ElevatedActionType): string => {
  return ELEVATED_ACTION_CONFIGS[actionType].description;
};

export interface ActionVerificationResult {
  verified: boolean;
  verificationLevel: VerificationLevel;
  timestamp: Date;
  expiresAt: Date;
  reason?: string;
}

export const createVerificationToken = async (
  actionType: ElevatedActionType,
  actorId: string
): Promise<ActionVerificationResult> => {
  const config = ELEVATED_ACTION_CONFIGS[actionType];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

  console.log(`[ELEVATED_ACTION] Verification required for ${actionType}`, {
    actorId,
    verificationLevel: config.requiredVerification,
    expiresAt,
  });

  return {
    verified: config.requiredVerification === "NONE",
    verificationLevel: config.requiredVerification,
    timestamp: now,
    expiresAt,
  };
};

export const verifyElevatedAction = async (
  actionType: ElevatedActionType,
  verificationToken: string,
  actorId: string
): Promise<ActionVerificationResult> => {
  const config = ELEVATED_ACTION_CONFIGS[actionType];

  console.log(`[ELEVATED_ACTION] Verifying action: ${actionType}`, {
    actorId,
    requiredLevel: config.requiredVerification,
  });

  return {
    verified: true,
    verificationLevel: config.requiredVerification,
    timestamp: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };
};

export const isElevatedAction = (actionType: ElevatedActionType): boolean => {
  return actionType in ELEVATED_ACTION_CONFIGS;
};

export const canPerformElevatedAction = async (
  actorRole: Role,
  actionType: ElevatedActionType
): Promise<{ allowed: boolean; reason?: string }> => {
  if (!hasRole(actorRole, ROLES.SUPER_ADMIN)) {
    const elevatedActions: ElevatedActionType[] = [
      "FINANCIAL_TRANSFER",
      "ROLE_ESCALATION",
      "ADMIN_CREATION",
      "PERMISSION_GRANT",
      "SYSTEM_CONFIG_CHANGE",
      "API_KEY_GENERATION",
    ];

    if (elevatedActions.includes(actionType)) {
      return {
        allowed: false,
        reason: "Super Admin role required for this action",
      };
    }

    if (actionType === "DATA_DELETE" || actionType === "BULK_OPERATION") {
      if (!hasRole(actorRole, ROLES.ADMIN)) {
        return {
          allowed: false,
          reason: "Admin role or higher required for this action",
        };
      }
    }
  }

  return { allowed: true };
};

export const SELF_PROTECTION_ACTIONS = [
  "SELF_DEMOTE",
  "SELF_DELETE",
  "SELF_REVOKE_SUPER_ADMIN",
  "SELF_DISABLE_MFA",
] as const;

export type SelfProtectionAction = (typeof SELF_PROTECTION_ACTIONS)[number];

export const isSelfProtectionAction = (action: string): action is SelfProtectionAction => {
  return SELF_PROTECTION_ACTIONS.includes(action as SelfProtectionAction);
};

export const preventSelfDestructiveAction = (
  actorId: string,
  targetId: string,
  action: SelfProtectionAction
): boolean => {
  if (actorId === targetId) {
    console.warn(`[SELF_PROTECTION] Blocked self-destructive action: ${action}`, {
      actorId,
      action,
    });
    return true;
  }
  return false;
};
