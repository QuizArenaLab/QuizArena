import { NextRequest } from "next/server";
import { QuestionController } from "../../../features/questions/server/api/QuestionController";

export async function POST(req: NextRequest) {
  // Pure delegation: no business logic, no Prisma, no Zod
  return QuestionController.createQuestion(req);
}
