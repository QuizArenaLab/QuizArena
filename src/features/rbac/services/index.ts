export * from "./roles";
export * from "./hierarchy";

export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  getRolePermissionsWithInheritance,
  getPermissionHierarchy,
  getInheritedRoles,
  getHighestRoleWithPermission,
  getRolesWithPermission,
  PERMISSION_MATRIX,
  hasPermissionInMatrix,
  type Permission,
} from "./permission-map";

export * from "./permission-constants";
export * from "./validators";
export * from "./access-control";

export {
  getCurrentUserFromSession,
  getCurrentRoleFromSession,
  getPermissionsFromSession,
  requireAuth,
  requireRole,
  requireMinimumRole,
  requireModerator,
  requireAdmin,
  requirePermission as guardRequirePermission,
  assertAuth,
  assertRole,
  assertMinimumRole,
  assertPermission as guardAssertPermission,
  checkAuth,
  checkRole,
  checkMinimumRole,
  checkPermission as guardCheckPermission,
  canAccessRoute,
  getRequiredRoleForRoute,
  AuthorizationError,
  PermissionDeniedError,
  RoleDeniedError,
  AuthenticationError,
  throwIfNotAuthenticated,
  throwIfRoleDenied,
  throwIfMinimumRoleDenied,
  throwIfPermissionDenied,
  safeGetCurrentUser,
  safeCheckPermission,
  getAllPermissions,
  hasAnyPermission as guardHasAnyPermission,
  hasAllPermissions as guardHasAllPermissions,
  type AuthUser,
} from "./guards";

export * from "./route-protection";

export * from "./session-security";
export * from "./role-escalation";
export * from "./ownership";
export * from "./security-events";
export * from "./ui-visibility";

export {
  canManageChallenges,
  canManageQuestions,
  canModerateUsers,
  canManageModerators,
  canManageAdmins,
  canManagePlatform,
  canManageFinancials,
  canApproveContent,
  canReviewPerformance,
  canManageSettings,
  canCreateAdmin,
  ROLE_PERMISSIONS,
} from "./permissions";

export {
  createApiAuthGuard,
  validateApiAccess,
  getProtectionLevel,
  API_PROTECTION_MAP,
  type ApiProtectionLevel,
} from "./api-protection";

export {
  isSuperAdmin as checkIsSuperAdminRole,
  superAdminOnlyGuard as basicSuperAdminGuard,
  requireSuperAdmin as enhancedRequireSuperAdmin,
  isSuperAdmin,
  assertSuperAdmin,
  checkSuperAdminAccess,
  isSuperAdminRoute,
  isFinancialRoute,
  isInfrastructureRoute,
  isRoleManagementRoute,
  validateSuperAdminAccess,
  validateFinancialAccess,
  validateInfrastructureAccess,
  validateRoleManagementAccess,
  requireFinancialAccess,
  requireInfrastructureAccess,
  requireRoleManagementAccess,
  protectSuperAdminRoute,
  createSuperAdminGuard,
  createFinancialGuard,
  createInfrastructureGuard,
  createRoleManagementGuard,
  SUPER_ADMIN_ROUTES,
  FINANCIAL_ROUTES,
  INFRASTRUCTURE_ROUTES,
  ROLE_MANAGEMENT_ROUTES,
  SuperAdminSecurityError,
  type SuperAdminErrorCode,
  type SuperAdminValidationResult,
} from "./super-admin";

export {
  createAuditEvent,
  auditRoleChange,
  auditFinancialAccess,
  auditInfrastructureAction,
  auditAdminCreation,
  auditPermissionEscalation,
  auditPrivilegedAction,
  verifySuperAdminSession,
  checkPrivilegeRevocation,
  superAdminSessionGuard,
  type AuditEventType,
  type AuditEvent,
  type SessionHardeningConfig,
  DEFAULT_SESSION_HARDENING_CONFIG,
} from "./super-admin-security";

export * from "./elevated-actions";

export {
  validateServerAuth,
  requireServerAuth,
  validateRoleAccess,
  requireRoleAccess,
  validateMinimumRoleAccess,
  requireMinimumRoleAccess,
  validatePermissionAccess,
  requirePermissionAccess,
  validateSelfProtection,
  validateNoRoleEscalation,
  validateNoSelfRoleChange,
  createProductionGuard,
  getProductionProtectionLevel,
  isProductionRouteProtected,
  PRODUCTION_ROUTE_PATTERNS,
  logSecurityEvent,
  type SecurityEventType,
  type ProductionSecurityConfig,
  DEFAULT_SECURITY_CONFIG,
  type RBACErrorCode,
  type ProtectionContext,
  type SecurityValidationResult,
} from "./production-hardening";

export {
  getKernelContext,
  assertKernelContext,
  validateKernelRole,
  requireKernelRole,
  validateKernelPermission,
  requireKernelPermission,
  checkKernelAccess,
  kernelCanAccessRoute,
  sanitizeKernelRole,
  preventKernelEscalation,
  preventKernelSelfChange,
  validateKernelPrivilegedOperation,
  KERNEL_PRIVILEGED_OPERATIONS,
  type RBACKernelErrorCode,
  type KernelUserContext,
} from "./kernel";

export {
  runRBACAudit,
  runQuickAudit,
  AUDIT_CATEGORIES,
  type RBACAuditResult,
  type RBACAuditIssue,
} from "./audit";
