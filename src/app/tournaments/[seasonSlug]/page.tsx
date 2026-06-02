import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { SeasonalBanner } from '@/features/tournaments/components/SeasonalBanner';
import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";

interface SeasonPageProps {
  params: { seasonSlug: string };
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const season = await prisma.season.findUnique({
    where: { slug: params.seasonSlug },
    include: {
      tournaments: {
        orderBy: { startsAt: "asc" },
      },
    },
  });

  if (!season) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-12">
      <SeasonalBanner
        seasonName={season.name}
        category={season.category || "General"}
        description={season.description}
        status={season.status as any}
        endsAt={season.endsAt}
      />

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[#0A1C40] border-b border-gray-200 pb-4">
          Season Tournaments
        </h2>

        <div className="space-y-4">
          {season.tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${season.slug}/${tournament.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow hover:border-blue-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                          tournament.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tournament.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {tournament.description ||
                        "Compete in this tournament stage to climb the rankings."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 md:border-l md:border-gray-100 md:pl-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Starts
                    </p>
                    <p className="text-sm font-bold text-[#0A1C40]">
                      {new Date(tournament.startsAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </Link>
          ))}

          {season.tournaments.length === 0 && (
            <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
              No tournaments have been scheduled for this season yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
