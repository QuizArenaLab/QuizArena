import { prisma } from "../lib/prisma";
import {
  PERMISSIONS,
  PERMISSION_LABELS,
  PERMISSION_CATEGORIES,
} from '@/features/rbac/constants/authorization';
import { ROLE_PERMISSION_MAP } from '@/features/rbac/constants/authorization';

async function main() {
  console.log("Seeding RBAC system...");

  // 1. Seed Permissions
  const allPermissionKeys = Object.values(PERMISSIONS).flatMap((group) => Object.values(group));

  for (const key of allPermissionKeys) {
    const label = PERMISSION_LABELS[key as keyof typeof PERMISSION_LABELS] || key;

    // Find category
    let category = "OTHER";
    for (const [cat, keys] of Object.entries(PERMISSION_CATEGORIES)) {
      if ((keys as readonly string[]).includes(key)) {
        category = cat.toUpperCase();
        break;
      }
    }

    await prisma.permission.upsert({
      where: { key },
      update: {
        description: label,
        category: category,
      },
      create: {
        key,
        description: label,
        category: category,
      },
    });
    console.log(`Upserted permission: ${key}`);
  }

  // 2. Seed RolePermissions
  for (const roleMap of Object.values(ROLE_PERMISSION_MAP)) {
    const role = roleMap.role;
    const permissions = roleMap.permissions;

    for (const permKey of permissions) {
      const permissionRecord = await prisma.permission.findUnique({
        where: { key: permKey },
      });

      if (permissionRecord) {
        await prisma.rolePermission.upsert({
          where: {
            role_permissionId: {
              role: role,
              permissionId: permissionRecord.id,
            },
          },
          update: {},
          create: {
            role: role,
            permissionId: permissionRecord.id,
          },
        });
      }
    }
    console.log(`Upserted roles permissions for: ${role}`);
  }

  console.log("RBAC seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
