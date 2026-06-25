import { NextResponse } from "next/server";
import { getOperationalIssues } from "@/features/admin/services/questions/operations/service";
import { OperationalIssueStatus } from "@/generated/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const issueType = url.searchParams.get("issueType");
    
    const params: any = {};
    if (issueType) {
      params.issueTypes = [issueType];
    }
    
    const result = await getOperationalIssues(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET_ISSUES_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
