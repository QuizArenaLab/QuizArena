import { requireAdmin } from "@/features/rbac/constants/authorization";
import { AdminWorkspaceGuard } from "@/components/guards/AdminWorkspaceGuard";
import { CompetitionStudioLayout } from "@/features/admin/competition/components/CompetitionStudioLayout";
import { CompetitionService } from "@/features/admin/competition/services/competition.service";
import { notFound } from "next/navigation";

export default async function CompetitionAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAdmin();
  if (!user || !user.id) return null;
  const competition = await CompetitionService.getCompetitionById(id);

  if (!competition) notFound();

  return (
    <AdminWorkspaceGuard userId={user.id as string} role={user.role as any}>
      <CompetitionStudioLayout competitionId={competition.id} title={competition.title}>
        <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Analytics & Results</h2>
          <p className="text-muted-foreground mb-6">
            View participation metrics, leaderboards, and performance insights.
          </p>
          <div className="p-8 text-center border-2 border-dashed rounded-md bg-muted/20">
            <p className="text-muted-foreground">
              Analytics dashboard will be implemented in Phase 2.
            </p>
          </div>
        </div>
      </CompetitionStudioLayout>
    </AdminWorkspaceGuard>
  );
}
