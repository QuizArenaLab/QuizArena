import { requireServerAuth } from "@/features/rbac/services/production-hardening";
import { ROLES, ROLE_VALUES } from "@/features/rbac/services/roles";
import { prisma } from "@/lib/prisma";
import { PermissionMatrix } from "./components/PermissionMatrix";
import { Shield, ShieldAlert, Key } from "lucide-react";
import { PERMISSION_CATEGORIES } from "@/features/rbac/services/permission-constants";

export const metadata = {
  title: "Global RBAC Governance | Sovereign Command",
};

export default async function RBACGovernancePage() {
  await requireServerAuth("route", "/login", {
    enableDBValidation: true,
    enablePrivilegeRevocationCheck: true,
    enableAuditLogging: true,
    denyByDefault: true,
  });

  // Fetch all permissions grouped by category
  const dbPermissions = await prisma.permission.findMany({
    orderBy: { category: "asc" },
  });

  // Fetch role-permission mappings
  const rolePermissions = await prisma.rolePermission.findMany({
    include: { permission: true },
  });

  // Re-map into an easier structure for the matrix: Record<Role, string[]>
  const mappedRolePermissions: Record<string, string[]> = {
    USER: [],
    MODERATOR: [],
    ADMIN: [],
    SUPER_ADMIN: [],
  };

  for (const rp of rolePermissions) {
    if (mappedRolePermissions[rp.role]) {
      mappedRolePermissions[rp.role].push(rp.permission.key);
    }
  }

  // Calculate some stats
  const totalPermissions = dbPermissions.length;
  const adminPermissionsCount = mappedRolePermissions[ROLES.ADMIN].length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Global RBAC Governance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sovereign control over platform authorization and access boundaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A101F] border border-slate-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Total Primitives
            </p>
            <p className="text-2xl font-bold text-slate-100">{totalPermissions}</p>
          </div>
        </div>
        <div className="bg-[#0A101F] border border-slate-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Admin Authority
            </p>
            <p className="text-2xl font-bold text-slate-100">{adminPermissionsCount}</p>
          </div>
        </div>
        <div className="bg-[#0A101F] border border-slate-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Enforcement Layer
            </p>
            <p className="text-lg font-bold text-slate-100">Server Authoritative</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A101F] border border-slate-800/60 rounded-xl overflow-hidden">
        <PermissionMatrix
          permissions={dbPermissions}
          roles={ROLE_VALUES}
          initialRolePermissions={mappedRolePermissions}
          categories={Object.keys(PERMISSION_CATEGORIES)}
        />
      </div>
    </div>
  );
}
