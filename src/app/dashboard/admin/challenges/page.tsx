import { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Challenge Management | QuizArena Admin",
  description: "Manage challenges, drafts, and schedules",
};

export default async function AdminChallengesPage() {
  const drafts = await prisma.challenge.findMany({
    where: { status: "DRAFT" },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: { _count: { select: { questions: true } } },
  });

  const scheduled = await prisma.challenge.findMany({
    where: { status: "SCHEDULED" },
    orderBy: { scheduledAt: "asc" },
    take: 10,
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Challenge Orchestration</h2>
          <p className="text-muted-foreground">Manage competitive assessment assets.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* We will route to a new challenge creation modal or page. For now just to builder with a new id or an API route */}
          <form
            action={async (formData) => {
              "use server";
              const { createChallengeDraft } = await import("@/actions/challenge-builder");
              const res = await createChallengeDraft({ title: "New Challenge - " + Date.now() });
              if (res.success && res.challengeId) {
                const { redirect } = await import("next/navigation");
                redirect(`/dashboard/admin/challenges/builder/${res.challengeId}`);
              }
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Challenge
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Draft Challenges</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            {drafts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No drafts found.</p>
            ) : (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div key={draft.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{draft.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {draft._count.questions} questions • Last updated{" "}
                        {format(draft.updatedAt, "MMM d, yyyy")}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/admin/challenges/builder/${draft.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Scheduled Challenges</h3>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            {scheduled.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scheduled challenges.</p>
            ) : (
              <div className="space-y-4">
                {scheduled.map((sch) => (
                  <div key={sch.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{sch.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {sch._count.questions} questions •{" "}
                        {sch.scheduledAt ? format(sch.scheduledAt, "MMM d, yyyy HH:mm") : "N/A"}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/admin/challenges/builder/${sch.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
