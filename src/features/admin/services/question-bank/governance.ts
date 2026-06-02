/**
 * QuizArena — Question Governance Lifecycle Engine
 *
 * Deterministic state machine for question status transitions.
 * Enforces role-based authorization for each transition.
 *
 * Lifecycle:
 *   DRAFT → REVIEW → APPROVED → ARCHIVED
 *                  → REJECTED → DRAFT
 *   Any status → FLAGGED (Admin/SuperAdmin only)
 *   FLAGGED → DRAFT (Admin/SuperAdmin only)
 *   ARCHIVED → DRAFT (Admin/SuperAdmin only)
 */

import type { QuestionStatusKey } from "./constants";

// ─── Transition Map ─────────────────────────────────────────────────────────

/**
 * Valid status transitions: maps current status to array of allowed target statuses.
 */
export const GOVERNANCE_TRANSITIONS: Record<QuestionStatusKey, QuestionStatusKey[]> = {
  DRAFT: ["REVIEW"],
  REVIEW: ["APPROVED", "REJECTED", "DRAFT"],
  APPROVED: ["ARCHIVED", "FLAGGED"],
  REJECTED: ["DRAFT", "FLAGGED"],
  ARCHIVED: ["DRAFT", "FLAGGED"],
  FLAGGED: ["DRAFT", "ARCHIVED"],
};

/**
 * Minimum role required for each transition.
 * MODERATOR = SME (create/edit drafts, submit for review)
 * ADMIN = governance authority (approve/reject/archive/flag)
 * SUPER_ADMIN = full override
 */
export type GovernanceRole = "MODERATOR" | "ADMIN" | "SUPER_ADMIN";

interface TransitionRule {
  from: QuestionStatusKey;
  to: QuestionStatusKey;
  minimumRole: GovernanceRole;
  requiresReason: boolean;
  description: string;
}

export const TRANSITION_RULES: TransitionRule[] = [
  // MODERATOR transitions (SME)
  {
    from: "DRAFT",
    to: "REVIEW",
    minimumRole: "MODERATOR",
    requiresReason: false,
    description: "Submit draft for review",
  },

  // ADMIN transitions (governance authority)
  {
    from: "REVIEW",
    to: "APPROVED",
    minimumRole: "ADMIN",
    requiresReason: false,
    description: "Approve reviewed question",
  },
  {
    from: "REVIEW",
    to: "REJECTED",
    minimumRole: "ADMIN",
    requiresReason: true,
    description: "Reject reviewed question",
  },
  {
    from: "REVIEW",
    to: "DRAFT",
    minimumRole: "ADMIN",
    requiresReason: true,
    description: "Return to draft for revision",
  },
  {
    from: "APPROVED",
    to: "ARCHIVED",
    minimumRole: "ADMIN",
    requiresReason: false,
    description: "Archive approved question",
  },
  {
    from: "APPROVED",
    to: "FLAGGED",
    minimumRole: "ADMIN",
    requiresReason: true,
    description: "Flag approved question for concern",
  },
  {
    from: "REJECTED",
    to: "DRAFT",
    minimumRole: "MODERATOR",
    requiresReason: false,
    description: "Revise rejected question",
  },
  {
    from: "REJECTED",
    to: "FLAGGED",
    minimumRole: "ADMIN",
    requiresReason: true,
    description: "Flag rejected question",
  },
  {
    from: "ARCHIVED",
    to: "DRAFT",
    minimumRole: "ADMIN",
    requiresReason: false,
    description: "Unarchive to draft",
  },
  {
    from: "ARCHIVED",
    to: "FLAGGED",
    minimumRole: "ADMIN",
    requiresReason: true,
    description: "Flag archived question",
  },
  {
    from: "FLAGGED",
    to: "DRAFT",
    minimumRole: "ADMIN",
    requiresReason: true,
    description: "Unflag and return to draft",
  },
  {
    from: "FLAGGED",
    to: "ARCHIVED",
    minimumRole: "ADMIN",
    requiresReason: false,
    description: "Archive flagged question",
  },
];

// ─── Role Hierarchy ─────────────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<GovernanceRole, number> = {
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

function hasMinimumGovernanceRole(userRole: string, requiredRole: GovernanceRole): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as GovernanceRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
}

// ─── Validation Functions ───────────────────────────────────────────────────

export interface TransitionValidationResult {
  valid: boolean;
  error?: string;
  rule?: TransitionRule;
}

/**
 * Check if a status transition is valid.
 */
export function isValidTransition(currentStatus: string, targetStatus: string): boolean {
  const allowed = GOVERNANCE_TRANSITIONS[currentStatus as QuestionStatusKey];
  if (!allowed) return false;
  return allowed.includes(targetStatus as QuestionStatusKey);
}

/**
 * Validate a governance transition including role authorization.
 */
export function validateTransition(
  currentStatus: string,
  targetStatus: string,
  userRole: string,
  reason?: string
): TransitionValidationResult {
  // Check if transition exists
  if (!isValidTransition(currentStatus, targetStatus)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentStatus} to ${targetStatus}`,
    };
  }

  // Find matching rule
  const rule = TRANSITION_RULES.find((r) => r.from === currentStatus && r.to === targetStatus);

  if (!rule) {
    return {
      valid: false,
      error: `No governance rule found for ${currentStatus} → ${targetStatus}`,
    };
  }

  // Check role authorization
  if (!hasMinimumGovernanceRole(userRole, rule.minimumRole)) {
    return {
      valid: false,
      error: `Insufficient role. Requires ${rule.minimumRole} or higher.`,
    };
  }

  // Check reason requirement
  if (rule.requiresReason && (!reason || reason.trim().length === 0)) {
    return {
      valid: false,
      error: `Reason is required for ${rule.description}`,
    };
  }

  return { valid: true, rule };
}

/**
 * Get available transitions for a given status and role.
 */
export function getAvailableTransitions(currentStatus: string, userRole: string): TransitionRule[] {
  return TRANSITION_RULES.filter(
    (rule) => rule.from === currentStatus && hasMinimumGovernanceRole(userRole, rule.minimumRole)
  );
}

/**
 * Check if a user role can edit a question in its current status.
 * Only DRAFT and REJECTED questions can be edited.
 * MODERATOR can only edit their own questions.
 */
export function canEditQuestion(questionStatus: string, userRole: string): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  if (userRole === "ADMIN") {
    return questionStatus === "DRAFT" || questionStatus === "REJECTED";
  }
  if (userRole === "MODERATOR") {
    return questionStatus === "DRAFT" || questionStatus === "REJECTED";
  }
  return false;
}

/**
 * Get governance action display metadata.
 */
export function getTransitionAction(
  from: string,
  to: string
): { label: string; variant: "approve" | "reject" | "neutral" | "warning" } | null {
  const actionMap: Record<
    string,
    { label: string; variant: "approve" | "reject" | "neutral" | "warning" }
  > = {
    "DRAFT→REVIEW": { label: "Submit for Review", variant: "neutral" },
    "REVIEW→APPROVED": { label: "Approve", variant: "approve" },
    "REVIEW→REJECTED": { label: "Reject", variant: "reject" },
    "REVIEW→DRAFT": { label: "Return to Draft", variant: "neutral" },
    "APPROVED→ARCHIVED": { label: "Archive", variant: "neutral" },
    "APPROVED→FLAGGED": { label: "Flag", variant: "warning" },
    "REJECTED→DRAFT": { label: "Revise", variant: "neutral" },
    "REJECTED→FLAGGED": { label: "Flag", variant: "warning" },
    "ARCHIVED→DRAFT": { label: "Unarchive", variant: "neutral" },
    "ARCHIVED→FLAGGED": { label: "Flag", variant: "warning" },
    "FLAGGED→DRAFT": { label: "Unflag", variant: "neutral" },
    "FLAGGED→ARCHIVED": { label: "Archive", variant: "neutral" },
  };

  return actionMap[`${from}→${to}`] ?? null;
}
