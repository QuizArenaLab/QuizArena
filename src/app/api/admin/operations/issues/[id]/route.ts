import { NextResponse } from "next/server";
import { getIssueDetails } from "@/features/admin/services/questions/operations/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = await getIssueDetails(id);
    if (!issue) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json(issue);
  } catch (error) {
    console.error("[GET_ISSUE_DETAILS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
