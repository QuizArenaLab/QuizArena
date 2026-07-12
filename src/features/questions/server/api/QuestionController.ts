import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { QuestionService } from "../services/QuestionService";
import { CreateQuestionSchema } from "../../shared/schemas";
import { ValidationError, StandardError } from "../errors";

const prisma = new PrismaClient();
const questionService = new QuestionService(prisma);

export class QuestionController {
  public static async createQuestion(req: NextRequest) {
    try {
      const body = await req.json();

      // 1. Zod Validation
      const parseResult = CreateQuestionSchema.safeParse(body);
      if (!parseResult.success) {
        throw new ValidationError("Invalid question data", parseResult.error.format());
      }

      // Temporary hardcoded user ID for auth bypass (would normally come from session)
      const userId = "temp-user-id";

      // 2. Delegate to Service
      const result = await questionService.createQuestion(userId, parseResult.data);

      // 3. Return DTO Payload
      return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error: any) {
      if (error instanceof StandardError) {
        return NextResponse.json(
          { success: false, error: error.message, details: error.details },
          { status: error.statusCode }
        );
      }
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  }
}
