import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getPlatformHealth = unstable_cache(
  async () => {
    let dbStatus = "Offline";
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "Healthy";
    } catch (e) {
      dbStatus = "Warning";
    }

    return [
      { name: "Database", status: dbStatus, iconName: "Database" },
      { name: "API", status: "Healthy", iconName: "Globe" },
      { name: "Notifications", status: "Warning", iconName: "Bell" },
      { name: "Authentication", status: "Healthy", iconName: "Key" },
      { name: "Storage", status: "Healthy", iconName: "HardDrive" },
    ];
  },
  ["admin-platform-health"],
  { revalidate: 15, tags: ["admin", "health"] }
);
