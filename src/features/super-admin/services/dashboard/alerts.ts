import { prisma } from "@/lib/prisma";
import type { OperationalAlertData, SovereignAlert } from "@/types/super-admin-dashboard";

export async function getOperationalAlerts(): Promise<OperationalAlertData> {
  const alerts: SovereignAlert[] = [];

  // High risk audit events as alerts
  const recentCriticalEvents = await prisma.auditLog.findMany({
    where: { severity: { in: ["HIGH", "CRITICAL"] } },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  recentCriticalEvents.forEach((event) => {
    alerts.push({
      id: `audit-${event.id}`,
      title: event.action,
      description: `Target: ${event.targetUserId || "System"}. Actor: ${event.actorId || "System"}.`,
      severity: event.severity === "CRITICAL" ? "EMERGENCY" : "CRITICAL",
      timestamp: event.createdAt,
      category: "SECURITY",
    });
  });

  // System alerts
  const suspendedUsers = await prisma.user.count({ where: { accountState: "SUSPENDED" } });
  if (suspendedUsers > 5) {
    alerts.push({
      id: "alert-suspensions",
      title: "Multiple Account Suspensions",
      description: `${suspendedUsers} accounts are currently suspended.`,
      severity: "WARNING",
      timestamp: new Date(),
      category: "OPERATIONS",
    });
  }

  // Synthetic infrastructure alert if no others
  if (alerts.length === 0) {
    alerts.push({
      id: "alert-info-1",
      title: "All Systems Nominal",
      description: "No operational or security alerts detected.",
      severity: "INFO",
      timestamp: new Date(),
      category: "INFRASTRUCTURE",
    });
  }

  const criticalCount = alerts.filter(
    (a) => a.severity === "CRITICAL" || a.severity === "EMERGENCY"
  ).length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING").length;

  return {
    activeAlerts: alerts,
    criticalCount,
    warningCount,
  };
}
