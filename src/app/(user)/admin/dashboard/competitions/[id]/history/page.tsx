import { requireAdmin } from "@/features/rbac/constants/authorization";
import { AdminWorkspaceGuard } from "@/components/guards/AdminWorkspaceGuard";
import { CompetitionStudioLayout } from "@/features/admin/competition/components/CompetitionStudioLayout";
import { CompetitionService } from "@/features/admin/competition/services/competition.service";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function CompetitionHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAdmin();
  if (!user || !user.id) return null;
  const competition = await CompetitionService.getCompetitionById(id);

  if (!competition) notFound();

  const auditTrail = await CompetitionService.getCompetitionAuditTrail(id);

  return (
    <AdminWorkspaceGuard userId={user.id as string} role={user.role as any}>
      <CompetitionStudioLayout competitionId={competition.id} title={competition.title}>
        <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Audit Trail</h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
            {auditTrail.map((log) => (
              <div
                key={log.id}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted-foreground/10 text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <span className="text-xs font-semibold">{log.action[0]}</span>
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-background shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm">{log.action}</div>
                    <time className="text-xs text-muted-foreground">
                      {format(log.createdAt, "MMM d, HH:mm")}
                    </time>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Actor: {log.actor?.name || log.actor?.email || log.actorId}
                  </div>
                  {log.reason && (
                    <div className="text-sm mt-2 italic border-l-2 pl-2 border-primary/50">
                      &quot;{log.reason}&quot;
                    </div>
                  )}
                  {log.previousState && log.newState && (
                    <div className="text-xs mt-2 font-mono bg-muted/50 p-1 rounded inline-block">
                      {log.previousState} → {log.newState}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {auditTrail.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No history recorded yet.</div>
            )}
          </div>
        </div>
      </CompetitionStudioLayout>
    </AdminWorkspaceGuard>
  );
}
