"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireServerAuth } from "@/features/rbac/services/production-hardening";
import { ROLES, type Role } from "@/features/rbac/services/roles";

export async function toggleRolePermission(
  role: Role,
  permissionKey: string,
  enabled: boolean,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authResult = await requireServerAuth("server-action");

    if (authResult.role !== ROLES.SUPER_ADMIN) {
      return { success: false, error: "Only Super Admin can modify global permissions" };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: "A valid audit reason (min 5 characters) is required" };
    }

    const permission = await prisma.permission.findUnique({
      where: { key: permissionKey },
    });

    if (!permission) {
      return { success: false, error: "Permission not found" };
    }

    await prisma.$transaction(async (tx) => {
      if (enabled) {
        await tx.rolePermission.upsert({
          where: {
            role_permissionId: {
              role,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            role,
            permissionId: permission.id,
          },
        });
      } else {
        await tx.rolePermission
          .delete({
            where: {
              role_permissionId: {
                role,
                permissionId: permission.id,
              },
            },
          })
          .catch((e) => {
            // Ignore if it doesn't exist
            if (e.code !== "P2025") throw e;
          });
      }

      await tx.auditLog.create({
        data: {
          action: enabled ? "PERMISSION_GRANT" : "PERMISSION_REVOKE",
          entityType: "SECURITY",
          severity: "HIGH",
          metadata: {
            reason: reason.trim(),
            targetRole: role,
            permissionKey,
            actorRole: authResult.role!,
          },
          actorId: authResult.userId!,
        },
      });
    });

    revalidatePath("/dashboard/super-admin/rbac");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle permission:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
