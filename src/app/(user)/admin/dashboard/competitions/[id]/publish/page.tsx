import { requireAdmin } from "@/features/rbac/constants/authorization";
import { AdminWorkspaceGuard } from "@/components/guards/AdminWorkspaceGuard";
import { CompetitionStudioLayout } from "@/features/admin/competition/components/CompetitionStudioLayout";
import { notFound } from "next/navigation";
import { PublishingWorkspace } from "@/features/admin/competition/publishing/components/PublishingWorkspace";
import { getPublishingWorkspaceData } from "@/features/admin/competition/publishing/publishing/actions/publishing.actions";

export default async function CompetitionPublishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAdmin();
  if (!user || !user.id) return null;

  let workspaceData;
  try {
    workspaceData = await getPublishingWorkspaceData(id);
  } catch (err) {
    console.error("Error loading publishing workspace:", err);
    notFound();
  }

  return (
    <AdminWorkspaceGuard userId={user.id as string} role={user.role as any}>
      <CompetitionStudioLayout
        competitionId={workspaceData.competition.id}
        title={workspaceData.competition.title}
      >
        {/* Overriding the default studio layout padding since workspace manages its own layout */}
        <div className="absolute inset-0 bg-white z-50 overflow-hidden">
          <PublishingWorkspace initialData={workspaceData} currentUserId={user.id as string} />
        </div>
      </CompetitionStudioLayout>
    </AdminWorkspaceGuard>
  );
}
