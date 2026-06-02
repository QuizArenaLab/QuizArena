/**
 * QuizArena — Super Admin Governance Layer
 *
 * Barrel export for the sovereign authority foundation.
 * ALL super-admin operations should import from this module.
 *
 * @module super-admin
 */

// ── Governance (primary validation & utilities) ──────────────────────────────
export {
  validateSuperAdmin,
  requireSuperAdmin,
  assertSuperAdmin,
  logSuperAdminAction,
  protectSuperAdminRoute,
  isSuperAdminPath,
  SuperAdminGovernanceError,
  type SuperAdminContext,
  type SuperAdminValidationResult,
  type SuperAdminErrorCode,
} from "./governance";

// ── Audit Enforcement ─────────────────────────────────────────────────────────
export {
  logSuperAdminAudit,
  auditSuperAdminLogin,
  auditRoleGovernance,
  auditHighRiskAction,
  auditFinancialAccess,
  auditInfrastructureAction,
  SUPER_ADMIN_AUDIT_CATEGORIES,
  RISK_SEVERITY_LABELS,
  type SuperAdminAuditEvent,
  type SuperAdminAuditCategory,
  type SuperAdminAuditResult,
  type RiskSeverity,
} from "./audit";

// ── Session Hardening ─────────────────────────────────────────────────────────
export {
  validateSuperAdminSession,
  getSuperAdminSessionContext,
  isSuperAdminSessionValid,
  DEFAULT_SESSION_CONFIG,
  HARDENED_SESSION_CONFIG,
  type SuperAdminSessionConfig,
  type SuperAdminSessionValidation,
  type SessionValidationReason,
} from "./session";

// ── High-Risk Action Infrastructure ───────────────────────────────────────────
export {
  validateHighRiskPreconditions,
  executeHighRiskAction,
  HIGH_RISK_ACTION_TYPES,
  HIGH_RISK_PROFILES,
  type HighRiskActionType,
  type HighRiskProfile,
  type HighRiskActionContext,
  type HighRiskValidationResult,
} from "./high-risk";

// ── Feature Rollouts (Platform Sovereignty) ──────────────────────────────────
export {
  evaluateRollout,
  isFeatureEnabled,
  createFeatureRollout,
  enableFeature,
  disableFeature,
  rollbackFeature,
  updateRollout,
  getFeatureRolloutsData,
} from "./feature-rollouts";

// ── Routes ────────────────────────────────────────────────────────────────────
export {
  SUPER_ADMIN_PATHS,
  SUPER_ADMIN_NAV_SECTIONS,
  isSuperAdminPath as isSuperAdminRoute,
  getSuperAdminSectionLabel,
  type SuperAdminPath,
} from "./routes";
