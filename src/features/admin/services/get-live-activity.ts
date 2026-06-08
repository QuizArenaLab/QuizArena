import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getLiveActivity = unstable_cache(
  async () => {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { actor: true },
    });

    return logs.map((log: any) => {
      let icon = "Activity";
      let message = log.action;
      let color = "text-gray-500";
      let bg = "bg-gray-100";

      const actionUpper = log.action.toUpperCase();

      if (log.entityType === "USER") {
        icon = "Users";
        color = "text-blue-500";
        bg = "bg-blue-50";
        if (
          actionUpper.includes("REGISTER") ||
          actionUpper.includes("JOIN") ||
          actionUpper.includes("CREATE")
        ) {
          message = "New user joined";
        } else if (actionUpper.includes("SUSPEND") || actionUpper.includes("BAN")) {
          icon = "Shield";
          color = "text-red-500";
          bg = "bg-red-50";
          message = "Admin restricted user";
        }
      } else if (log.entityType === "CHALLENGE") {
        icon = "Trophy";
        color = "text-green-500";
        bg = "bg-green-50";
        if (actionUpper.includes("PUBLISH") || actionUpper.includes("CREATE")) {
          message = "Competition published";
        } else if (actionUpper.includes("END")) {
          color = "text-indigo-500";
          bg = "bg-indigo-50";
          message = "Competition ended";
        }
      } else if (log.entityType === "REPORT") {
        icon = "CheckCircle";
        if (actionUpper.includes("RESOLVE")) {
          message = "Report resolved";
        }
      } else if (log.entityType === "FINANCIAL" || actionUpper.includes("PURCHASE")) {
        icon = "Target";
        color = "text-orange-500";
        bg = "bg-orange-50";
        message = "Purchase completed";
      } else if (log.severity === "CRITICAL" || log.severity === "HIGH") {
        icon = "AlertCircle";
        color = "text-amber-500";
        bg = "bg-amber-50";
      }

      if (log.actor?.name && message === log.action) {
        message = `${log.actor.name} - ${log.action}`;
      }

      return {
        id: log.id,
        iconName: icon,
        message,
        createdAt: log.createdAt,
        color,
        bg,
      };
    });
  },
  ["admin-live-activity"],
  { revalidate: 15, tags: ["admin", "activity"] }
);
