/**
 * QuizArena — Super Admin Canonical Route Map
 *
 * ALL super-admin routes MUST live under /dashboard/super-admin/*
 * This is the single source of truth for super-admin navigation.
 *
 * Route isolation is SECURITY-CRITICAL.
 * Do NOT reference these routes from admin or moderator navigation.
 */

export const SUPER_ADMIN_PATHS = {
  // ── Root ───────────────────────────────────────────────────
  ROOT: "/dashboard/super-admin",

  // ── Command Center (Strategic Dashboard) ───────────────────
  HOME: "/dashboard/super-admin/home",
  COMMAND_CENTER: "/dashboard/super-admin/home",

  // ── Financial Control ──────────────────────────────────────
  FINANCIAL: "/dashboard/super-admin/financial",

  // ── Infrastructure ─────────────────────────────────────────
  INFRASTRUCTURE: "/dashboard/super-admin/infrastructure",

  // ── Security Center ────────────────────────────────────────
  SECURITY: "/dashboard/super-admin/security",
  MONITORING: "/dashboard/super-admin/monitoring",

  // ── Governance (Role Authority) ────────────────────────────
  GOVERNANCE: "/dashboard/super-admin/governance",
  RBAC: "/dashboard/super-admin/rbac",
  ROLES: "/dashboard/super-admin/roles",
  STRATEGIC_INTELLIGENCE: "/dashboard/super-admin/strategic-intelligence",
  INTELLIGENCE: "/dashboard/super-admin/intelligence",

  // ── Compliance (Audit Systems) ─────────────────────────────
  COMPLIANCE: "/dashboard/super-admin/compliance",

  // ── Platform Controls (Feature Sovereignty) ────────────────
  PLATFORM_CONTROLS: "/dashboard/super-admin/platform-controls",
  FEATURE_ROLLOUTS: "/dashboard/super-admin/feature-rollouts",

  // ── Disaster Recovery (Fail-Safe Controls) ─────────────────
  DISASTER_RECOVERY: "/dashboard/super-admin/disaster-recovery",

  // ── Settings ───────────────────────────────────────────────
  SETTINGS: "/dashboard/super-admin/settings",
} as const;

export type SuperAdminPath = (typeof SUPER_ADMIN_PATHS)[keyof typeof SUPER_ADMIN_PATHS];

/**
 * Navigation sections for the sovereign sidebar.
 */
export const SUPER_ADMIN_NAV_SECTIONS = [
  {
    id: "command-center",
    label: "Command Center",
    description: "Strategic operational dashboard",
    href: SUPER_ADMIN_PATHS.HOME,
    icon: "LayoutDashboard",
  },
  {
    id: "financial-control",
    label: "Financial Control",
    description: "Revenue governance & financial systems",
    href: SUPER_ADMIN_PATHS.FINANCIAL,
    icon: "DollarSign",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Platform systems & deployment",
    href: SUPER_ADMIN_PATHS.INFRASTRUCTURE,
    icon: "Server",
  },
  {
    id: "security-center",
    label: "Security Center",
    description: "Threat monitoring & security events",
    href: SUPER_ADMIN_PATHS.SECURITY,
    icon: "ShieldAlert",
  },
  {
    id: "rbac-governance",
    label: "RBAC Governance",
    description: "Role authority & permission matrix",
    href: SUPER_ADMIN_PATHS.RBAC,
    icon: "Key",
  },
  {
    id: "compliance",
    label: "Compliance",
    description: "Audit systems & regulatory controls",
    href: SUPER_ADMIN_PATHS.COMPLIANCE,
    icon: "ClipboardCheck",
  },
  {
    id: "platform-controls",
    label: "Platform Controls",
    description: "Feature sovereignty & platform overrides",
    href: SUPER_ADMIN_PATHS.PLATFORM_CONTROLS,
    icon: "Sliders",
  },
  {
    id: "feature-rollouts",
    label: "Feature Rollouts",
    description: "Release governance & staging",
    href: SUPER_ADMIN_PATHS.FEATURE_ROLLOUTS,
    icon: "Rocket",
  },
  {
    id: "disaster-recovery",
    label: "Disaster Recovery",
    description: "Fail-safe controls & platform survivability",
    href: SUPER_ADMIN_PATHS.DISASTER_RECOVERY,
    icon: "LifeBuoy",
  },
  {
    id: "strategic-intelligence",
    label: "Strategic Command",
    description: "Executive business & growth oversight",
    href: SUPER_ADMIN_PATHS.STRATEGIC_INTELLIGENCE,
    icon: "BrainCircuit",
  },
] as const;

/**
 * Check if a pathname is within the super-admin authority boundary.
 */
export const isSuperAdminPath = (pathname: string): boolean => {
  return pathname.startsWith("/dashboard/super-admin");
};

/**
 * Get the section label for a given super-admin pathname.
 */
export const getSuperAdminSectionLabel = (pathname: string): string => {
  const section = SUPER_ADMIN_NAV_SECTIONS.find((s) => pathname.startsWith(s.href));
  return section?.label ?? "Super Admin";
};
