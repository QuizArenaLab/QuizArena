import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session-utils";
import { prisma } from "@/lib/prisma";
import { normalizeUsername, validateUsername } from "@/lib/onboarding";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const normalized = normalizeUsername(username);
    const validation = validateUsername(normalized);

    if (!validation.valid) {
      return NextResponse.json({ available: false, error: validation.error }, { status: 200 });
    }

    const whereClause: any = { username: normalized };
    if (user?.id) {
      whereClause.NOT = { id: user.id };
    }

    const existing = await prisma.user.findFirst({
      where: whereClause,
    });

    return NextResponse.json({ available: !existing }, { status: 200 });
  } catch (error: any) {
    // If the database is completely unreachable, Prisma throws P1001 or initialization errors.
    // We gracefully catch this so it doesn't break the UI with a hard 500 Network Error.
    const isDbUnreachable = 
      error?.message?.includes("Can't reach database server") || 
      error?.code === "P1001";
      
    if (isDbUnreachable) {
      console.warn("[check-username] Database is currently unreachable. Gracefully falling back to 'available' to not block UI.");
      return NextResponse.json({ available: true, warning: "DB_OFFLINE" }, { status: 200 });
    }

    console.error("Username check error:", error);
    return NextResponse.json({ error: "Failed to check username" }, { status: 500 });
  }
}
