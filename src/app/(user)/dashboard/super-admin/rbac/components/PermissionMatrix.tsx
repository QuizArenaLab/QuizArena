"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toggleRolePermission } from "@/features/rbac/services/rbac-actions";
import { type Role, ROLES } from "@/features/rbac/services/roles";

interface PermissionMatrixProps {
  permissions: { id: string; key: string; description: string | null; category: string }[];
  roles: readonly Role[];
  initialRolePermissions: Record<string, string[]>;
  categories: string[];
}

export function PermissionMatrix({
  permissions,
  roles,
  initialRolePermissions,
}: PermissionMatrixProps) {
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>(initialRolePermissions);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleToggle = async (role: Role, permKey: string, currentlyEnabled: boolean) => {
    // SUPER_ADMIN cannot have their own permissions revoked to prevent lockout.
    if (role === ROLES.SUPER_ADMIN && currentlyEnabled) {
      alert("SUPER_ADMIN permissions cannot be revoked through the interface to prevent lockout.");
      return;
    }

    const highRiskPrefixes = ["financial:", "platform:", "role:"];
    const isHighRisk = highRiskPrefixes.some((p) => permKey.startsWith(p));

    let reason = "Standard RBAC adjustment";

    if (isHighRisk) {
      const input = window.prompt(
        `WARNING: You are modifying a HIGH RISK permission (${permKey}) for ${role}.\n\nPlease provide a mandatory audit reason:`
      );
      if (!input || input.trim().length < 5) {
        alert("A valid audit reason (min 5 chars) is required for high-risk modifications.");
        return;
      }
      reason = input.trim();
    } else {
      const input = window.prompt(`Provide an audit reason for this permission change on ${role}:`);
      if (!input || input.trim().length < 5) {
        alert("A valid audit reason (min 5 chars) is required.");
        return;
      }
      reason = input.trim();
    }

    const stateKey = `${role}-${permKey}`;
    setLoadingKey(stateKey);

    try {
      const res = await toggleRolePermission(role, permKey, !currentlyEnabled, reason);

      if (res.success) {
        setRolePerms((prev) => {
          const roleSet = new Set(prev[role] || []);
          if (currentlyEnabled) {
            roleSet.delete(permKey);
          } else {
            roleSet.add(permKey);
          }
          return { ...prev, [role]: Array.from(roleSet) };
        });
      } else {
        alert(res.error || "Failed to update permission");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setLoadingKey(null);
    }
  };

  // Group permissions by category
  const groupedPermissions: Record<string, typeof permissions> = {};
  permissions.forEach((p) => {
    const cat = p.category;
    if (!groupedPermissions[cat]) groupedPermissions[cat] = [];
    groupedPermissions[cat].push(p);
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#0D1529] border-b border-slate-800/60 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-300 w-1/3">Permission</th>
            {roles.map((role) => (
              <th key={role} className="px-6 py-4 font-semibold text-center min-w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`text-xs uppercase tracking-wider ${
                      role === ROLES.SUPER_ADMIN
                        ? "text-red-400"
                        : role === ROLES.ADMIN
                          ? "text-blue-400"
                          : role === ROLES.MODERATOR
                            ? "text-emerald-400"
                            : "text-slate-400"
                    }`}
                  >
                    {role}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <React.Fragment key={category}>
              <tr className="bg-[#090E1A]">
                <td
                  colSpan={roles.length + 1}
                  className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest"
                >
                  {category}
                </td>
              </tr>
              {perms.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-200">{perm.key}</span>
                      <span className="text-xs text-slate-500">{perm.description}</span>
                    </div>
                  </td>
                  {roles.map((role) => {
                    const hasPerm = rolePerms[role]?.includes(perm.key) || false;
                    const isHighRisk = ["financial:", "platform:", "role:"].some((p) =>
                      perm.key.startsWith(p)
                    );
                    const stateKey = `${role}-${perm.key}`;
                    const isLoading = loadingKey === stateKey;

                    return (
                      <td key={`${role}-${perm.id}`} className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggle(role, perm.key, hasPerm)}
                          disabled={isLoading || (role === ROLES.SUPER_ADMIN && hasPerm)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0A101F] disabled:opacity-50 disabled:cursor-not-allowed ${
                            hasPerm
                              ? isHighRisk && role !== ROLES.SUPER_ADMIN
                                ? "bg-amber-500"
                                : role === ROLES.SUPER_ADMIN
                                  ? "bg-red-500/80"
                                  : "bg-blue-500"
                              : "bg-slate-700"
                          }`}
                          title={
                            role === ROLES.SUPER_ADMIN && hasPerm
                              ? "Super Admin permissions cannot be revoked"
                              : `Toggle ${perm.key} for ${role}`
                          }
                        >
                          <span className="sr-only">
                            Toggle {perm.key} for {role}
                          </span>
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 text-white animate-spin absolute" />
                          ) : (
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                hasPerm ? "translate-x-2" : "-translate-x-2"
                              }`}
                            />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
