/**
 * QuizArena — High-Risk Action Infrastructure
 *
 * Foundation for dangerous operational actions that require elevated confirmation.
 * Architecture: Multi-step validation, pre-flight checks, irreversibility protection.
 *
 * Future-ready for:
 * - Multi-confirmation workflows
 * - MFA confirmations
 * - Secure approval chains
 * - Recovery flows
 *
 * SECURITY: No dangerous one-click operations. ALL high-risk actions require
 * explicit confirmation context and pre-flight validation.
 */

import type { Role } from "@/features/rbac/services/roles";
import { validateSuperAdmin } from "./governance";
import { auditHighRiskAction } from "./audit";

// ─── High-Risk Action Types ───────────────────────────────────────────────────

export const HIGH_RISK_ACTION_TYPES = {
  MAINTENANCE_MODE: "MAINTENANCE_MODE",
  PLATFORM_SHUTDOWN: "PLATFORM_SHUTDOWN",
  ROLE_REVOCATION: "ROLE_REVOCATION",
  MASS_ROLE_CHANGE: "MASS_ROLE_CHANGE",
  FINANCIAL_OVERRIDE: "FINANCIAL_OVERRIDE",
  FEATURE_OVERRIDE: "FEATURE_OVERRIDE",
  DATA_PURGE: "DATA_PURGE",
  ADMIN_CREATION: "ADMIN_CREATION",
  SUPER_ADMIN_DELEGATION: "SUPER_ADMIN_DELEGATION",
  INFRASTRUCTURE_CONFIG: "INFRASTRUCTURE_CONFIG",
} as const;

export type HighRiskActionType =
  (typeof HIGH_RISK_ACTION_TYPES)[keyof typeof HIGH_RISK_ACTION_TYPES];

// ─── Risk Profiles ────────────────────────────────────────────────────────────

export interface HighRiskProfile {
  type: HighRiskActionType;
  label: string;
  description: string;
  severity: "CRITICAL" | "HIGH";
  reversible: boolean;
  requiresConfirmation: boolean;
  /** Future: require MFA re-verification */
  requiresMFA: boolean;
  /** Future: require secondary approver */
  requiresApproval: boolean;
  /** Minimum confirmation text the user must type */
  confirmationPhrase?: string;
  infrastructureImpact: string;
}

export const HIGH_RISK_PROFILES: Record<HighRiskActionType, HighRiskProfile> = {
  MAINTENANCE_MODE: {
    type: "MAINTENANCE_MODE",
    label: "Maintenance Mode",
    description: "Enables platform-wide maintenance mode, blocking all user access",
    severity: "CRITICAL",
    reversible: true,
    requiresConfirmation: true,
    requiresMFA: false,
    requiresApproval: false,
    confirmationPhrase: "ENABLE MAINTENANCE",
    infrastructureImpact: "Platform-wide access suspended for all users",
  },
  PLATFORM_SHUTDOWN: {
    type: "PLATFORM_SHUTDOWN",
    label: "Platform Shutdown",
    description: "Initiates graceful platform shutdown sequence",
    severity: "CRITICAL",
    reversible: false,
    requiresConfirmation: true,
    requiresMFA: true,
    requiresApproval: true,
    confirmationPhrase: "SHUTDOWN PLATFORM",
    infrastructureImpact: "Complete platform unavailability",
  },
  ROLE_REVOCATION: {
    type: "ROLE_REVOCATION",
    label: "Role Revocation",
    description: "Revokes elevated privileges from a user",
    severity: "HIGH",
    reversible: true,
    requiresConfirmation: true,
    requiresMFA: false,
    requiresApproval: false,
    infrastructureImpact: "User access level reduced",
  },
  MASS_ROLE_CHANGE: {
    type: "MASS_ROLE_CHANGE",
    label: "Mass Role Change",
    description: "Changes roles for multiple users simultaneously",
    severity: "CRITICAL",
    reversible: true,
    requiresConfirmation: true,
    requiresMFA: true,
    requiresApproval: true,
    confirmationPhrase: "MASS ROLE CHANGE",
    infrastructureImpact: "Multiple users' privileges affected simultaneously",
  },
  FINANCIAL_OVERRIDE: {
    type: "FINANCIAL_OVERRIDE",
    label: "Financial Override",
    description: "Performs a financial system override operation",
    severity: "CRITICAL",
    reversible: false,
    requiresConfirmation: true,
    requiresMFA: true,
    requiresApproval: true,
    confirmationPhrase: "FINANCIAL OVERRIDE",
    infrastructureImpact: "Financial transaction integrity affected",
  },
  FEATURE_OVERRIDE: {
    type: "FEATURE_OVERRIDE",
    label: "Feature Override",
    description: "Forces a feature flag state platform-wide",
    severity: "HIGH",
    reversible: true,
    requiresConfirmation: true,
    requiresMFA: false,
    requiresApproval: false,
    infrastructureImpact: "Platform feature availability changed",
  },
  DATA_PURGE: {
    type: "DATA_PURGE",
    label: "Data Purge",
    description: "Permanently removes data records",
    severity: "CRITICAL",
    reversible: false,
    requiresConfirmation: true,
    requiresMFA: true,
    requiresApproval: true,
    confirmationPhrase: "PURGE DATA PERMANENTLY",
    infrastructureImpact: "Permanent data deletion — unrecoverable",
  },
  ADMIN_CREATION: {
    type: "ADMIN_CREATION",
    label: "Admin Creation",
    description: "Grants Admin role to a user",
    severity: "HIGH",
    reversible: true,
    requiresConfirmation: true,
    requiresMFA: false,
    requiresApproval: false,
    infrastructureImpact: "New administrator granted platform management access",
  },
  SUPER_ADMIN_DELEGATION: {
    type: "SUPER_ADMIN_DELEGATION",
    label: "Super Admin Delegation",
    description: "Grants Super Admin role to a user",
    severity: "CRITICAL",
    reversible: true,
    requiresConfirmation: true,
    requiresMFA: true,
    requiresApproval: true,
    confirmationPhrase: "DELEGATE SOVEREIGN AUTHORITY",
    infrastructureImpact: "New sovereign authority entity created",
  },
  INFRASTRUCTURE_CONFIG: {
    type: "INFRASTRUCTURE_CONFIG",
    label: "Infrastructure Configuration",
    description: "Modifies core platform infrastructure settings",
    severity: "CRITICAL",
    reversible: false,
    requiresConfirmation: true,
    requiresMFA: false,
    requiresApproval: false,
    infrastructureImpact: "Core platform configuration changed",
  },
} as const;

// ─── High-Risk Action Context ─────────────────────────────────────────────────

export interface HighRiskActionContext {
  actionType: HighRiskActionType;
  actorId: string;
  actorRole: Role;
  actorEmail: string;
  targetId?: string;
  targetType?: string;
  reason?: string;
  confirmationProvided: boolean;
  /** User-typed confirmation text (validated against phrase) */
  confirmationText?: string;
  metadata?: Record<string, unknown>;
  initiatedAt: Date;
}

export interface HighRiskValidationResult {
  allowed: boolean;
  actionType: HighRiskActionType;
  profile: HighRiskProfile;
  reason?: string;
  requiresAdditionalStep?: "MFA" | "APPROVAL" | "CONFIRMATION";
}

// ─── Pre-flight Validation ────────────────────────────────────────────────────

/**
 * Validate preconditions for a high-risk action.
 * ALL high-risk operations MUST pass this before execution.
 */
export const validateHighRiskPreconditions = async (
  actionType: HighRiskActionType,
  confirmationText?: string
): Promise<HighRiskValidationResult> => {
  const profile = HIGH_RISK_PROFILES[actionType];

  // Validate super admin authority
  const authResult = await validateSuperAdmin();
  if (!authResult.authorized || !authResult.context) {
    return {
      allowed: false,
      actionType,
      profile,
      reason: "UNAUTHORIZED: Super Admin authority required",
    };
  }

  // Confirmation phrase validation
  if (profile.requiresConfirmation && profile.confirmationPhrase) {
    if (!confirmationText || confirmationText.trim() !== profile.confirmationPhrase) {
      return {
        allowed: false,
        actionType,
        profile,
        reason: `Confirmation required: type "${profile.confirmationPhrase}"`,
        requiresAdditionalStep: "CONFIRMATION",
      };
    }
  }

  // Future: MFA check
  if (profile.requiresMFA) {
    // TODO Phase 7.x: Verify MFA token
    // For now, log that MFA is required but not yet enforced
    console.warn(`[HIGH-RISK] Action ${actionType} requires MFA — not yet enforced`);
  }

  // Future: Approval workflow
  if (profile.requiresApproval) {
    // TODO Phase 7.x: Check approval chain
    console.warn(`[HIGH-RISK] Action ${actionType} requires approval — not yet enforced`);
  }

  return {
    allowed: true,
    actionType,
    profile,
  };
};

/**
 * Execute a high-risk action with full audit trail.
 * Wraps any dangerous operation with pre-flight validation + audit.
 */
export const executeHighRiskAction = async <T>(
  context: HighRiskActionContext,
  action: () => Promise<T>
): Promise<{ success: boolean; result?: T; error?: string }> => {
  const profile = HIGH_RISK_PROFILES[context.actionType];

  // Pre-flight validation
  const validation = await validateHighRiskPreconditions(
    context.actionType,
    context.confirmationText
  );

  if (!validation.allowed) {
    await auditHighRiskAction(
      context.actorId,
      context.actorRole,
      context.actorEmail,
      `HIGH_RISK_BLOCKED: ${context.actionType}`,
      profile.infrastructureImpact,
      {
        reason: validation.reason,
        targetId: context.targetId,
        targetType: context.targetType,
      }
    );
    return { success: false, error: validation.reason };
  }

  // Execute with audit trail
  try {
    await auditHighRiskAction(
      context.actorId,
      context.actorRole,
      context.actorEmail,
      `HIGH_RISK_INITIATED: ${context.actionType}`,
      profile.infrastructureImpact,
      {
        targetId: context.targetId,
        targetType: context.targetType,
        reason: context.reason,
        metadata: context.metadata,
      }
    );

    const result = await action();

    await auditHighRiskAction(
      context.actorId,
      context.actorRole,
      context.actorEmail,
      `HIGH_RISK_COMPLETED: ${context.actionType}`,
      profile.infrastructureImpact,
      {
        targetId: context.targetId,
        success: true,
        metadata: context.metadata,
      }
    );

    return { success: true, result };
  } catch (error) {
    await auditHighRiskAction(
      context.actorId,
      context.actorRole,
      context.actorEmail,
      `HIGH_RISK_FAILED: ${context.actionType}`,
      profile.infrastructureImpact,
      {
        targetId: context.targetId,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "High-risk action failed",
    };
  }
};
