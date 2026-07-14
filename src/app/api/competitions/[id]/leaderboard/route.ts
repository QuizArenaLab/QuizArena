import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: competitionId } = await params;
    const leaderboardKey = `COMPETITION:${competitionId}`;

    const [projection, snapshots] = await Promise.all([
      prisma.leaderboardProjection.findUnique({
        where: { leaderboardKey },
      }),
      prisma.rankingSnapshot.findMany({
        where: { leaderboardKey },
        orderBy: { rank: "asc" },
        include: {
          user: {
            select: { name: true, image: true, email: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      projection: projection || {
        participantCount: 0,
        highestScore: 0,
        averageScore: 0,
        averageAccuracy: 0,
      },
      snapshots,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
