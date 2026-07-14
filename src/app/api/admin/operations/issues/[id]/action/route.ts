import { NextResponse } from "next/server";
import { resolveIssue, dismissIssue } from "@/features/admin/services/questions/operations/service";
import { auth } from "@/auth/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminId = session.user.id;
    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    let issue;
    if (action === "RESOLVE") {
      issue = await resolveIssue(id, adminId, reason);
    } else if (action === "DISMISS") {
      issue = await dismissIssue(id, adminId, reason);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error("[POST_ISSUE_ACTION_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
