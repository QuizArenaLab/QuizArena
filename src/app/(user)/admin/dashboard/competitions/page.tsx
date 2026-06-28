import { requireAdmin } from "@/features/rbac/constants/authorization";
import { AdminWorkspaceGuard } from "@/components/guards/AdminWorkspaceGuard";
import { CompetitionStudioLayout } from "@/features/admin/competition/components/CompetitionStudioLayout";
import { CompetitionService } from "@/features/admin/competition/services/competition.service";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { format } from "date-fns";
import {
  COMPETITION_STATUS_LABELS,
  COMPETITION_TYPE_LABELS,
} from "@/features/admin/competition/models/competition.model";
import { Plus, Trophy, Clock, CalendarDays, MoreVertical, LayoutGrid } from "lucide-react";

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await requireAdmin();
  if (!user || !user.id) return null;
  const page = Number(searchParams.page) || 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  const result = await CompetitionService.getCompetitions({
    page,
    limit: 20,
    search,
  });

  return (
    <AdminWorkspaceGuard userId={user.id as string} role={user.role as any}>
      <CompetitionStudioLayout>
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-navy">
            <LayoutGrid className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold">All Competitions</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
              {result.total || result.competitions.length}
            </span>
          </div>
          <Link
            href={ROUTES.ADMIN.COMPETITION_CREATE}
            className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Create Competition
          </Link>
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {result.competitions.map((comp) => (
            <div
              key={comp.id}
              className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Card Header Background */}
              <div
                className={`h-2 w-full ${comp.status === "LIVE" ? "bg-green-500" : comp.status === "SCHEDULED" ? "bg-blue-500" : "bg-gray-200"}`}
              />

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-navy text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {comp.title}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${
                      comp.status === "LIVE"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : comp.status === "SCHEDULED"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                    }
                  `}
                  >
                    {COMPETITION_STATUS_LABELS[comp.status] || comp.status}
                  </span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-500 mt-auto mb-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-400" />
                    <span className="truncate">
                      {COMPETITION_TYPE_LABELS[comp.competitionType]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-indigo-400" />
                    <span>{comp._count.questions} Qs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-400" />
                    <span>{format(comp.createdAt, "MMM d")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{comp.durationMinutes}m</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    ID: {comp.id.substring(0, 8)}...
                  </span>
                  <Link
                    href={ROUTES.ADMIN.COMPETITION_OVERVIEW(comp.id)}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                  >
                    Manage
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {result.competitions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-navy mb-2">No Competitions Yet</h3>
            <p className="text-gray-500 max-w-md mb-8">
              You haven&apos;t created any competitions. Start by setting up a new arena for your
              candidates to compete in.
            </p>
            <Link
              href={ROUTES.ADMIN.COMPETITION_CREATE}
              className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Create First Competition
            </Link>
          </div>
        )}
      </CompetitionStudioLayout>
    </AdminWorkspaceGuard>
  );
}
