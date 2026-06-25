import { NextResponse } from "next/server";
import { resolveIssue, dismissIssue } from "@/features/admin/services/questions/operations/service";
// In a real app, use auth() to get the adminId. Hardcoded for demonstration.
const MOCK_ADMIN_ID = "mock-admin-id"; 

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    let issue;
    if (action === "RESOLVE") {
      issue = await resolveIssue(id, MOCK_ADMIN_ID, reason);
    } else if (action === "DISMISS") {
      issue = await dismissIssue(id, MOCK_ADMIN_ID, reason);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error("[POST_ISSUE_ACTION_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
