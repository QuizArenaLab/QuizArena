"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/auth/roles/role-hierarchy";
import { ROLE } from "@/auth/roles/role-types";
import { parseFile, validateRows, ValidatedRow, ImportRow } from "@/lib/question-bank/bulk-import";
import { generateQuestionCode } from "@/lib/question-bank/question-code";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

async function requireSmeSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }
  const userRole = (session.user.role as string) || "USER";
  if (!hasMinimumRole(userRole, ROLE.USER)) {
    // SME is typically MODERATOR or at least authorized user
    // Wait, let's assume SMEs are MODERATORS in this context, or we can check for MODERATOR.
    // The requirement says SMEs and ADMINs. So MODERATOR.
  }
  if (!hasMinimumRole(userRole, ROLE.MODERATOR)) {
    throw new Error("Forbidden: You do not have permission to import questions");
  }
  return { session, userRole };
}

export async function uploadAndPreviewImport(formData: FormData): Promise<{
  success: boolean;
  jobId?: string;
  previewRows?: ValidatedRow[];
  totalRows?: number;
  validRows?: number;
  invalidRows?: number;
  error?: string;
}> {
  try {
    const { session } = await requireSmeSession();

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      return { success: false, error: "Unsupported file format. Please upload .csv or .xlsx" };
    }

    const parsedRows = await parseFile(file);
    const validatedRows = await validateRows(parsedRows);

    const totalRows = validatedRows.length;
    const validRows = validatedRows.filter((r) => r.isValid).length;
    const invalidRows = totalRows - validRows;

    const errorReport = validatedRows
      .filter((r) => !r.isValid)
      .map((r) => ({
        rowNumber: r.rowNumber,
        errors: r.errors,
        data: r.data,
      }));

    // Create the import job
    const job = await prisma.questionImportJob.create({
      data: {
        uploadedById: session.user.id,
        fileName: file.name,
        fileType:
          file.type ||
          (file.name.endsWith(".csv")
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
        totalRows,
        validRows,
        invalidRows,
        status: "PENDING",
        errorReport: errorReport.length > 0 ? (errorReport as any) : undefined,
      },
    });

    return {
      success: true,
      jobId: job.id,
      previewRows: validatedRows,
      totalRows,
      validRows,
      invalidRows,
    };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process import",
    };
  }
}

export async function executeBulkImport(
  jobId: string,
  validRows: ValidatedRow[]
): Promise<{
  success: boolean;
  importedCount?: number;
  error?: string;
}> {
  try {
    const { session } = await requireSmeSession();

    const job = await prisma.questionImportJob.findUnique({ where: { id: jobId } });
    if (!job) {
      return { success: false, error: "Import job not found" };
    }
    if (job.status !== "PENDING") {
      return { success: false, error: "Import job has already been processed" };
    }
    if (job.uploadedById !== session.user.id) {
      return { success: false, error: "You can only execute your own imports" };
    }

    // Filter out valid rows to insert
    const rowsToInsert = validRows.filter((r) => r.isValid && r.parsedData);

    if (rowsToInsert.length === 0) {
      await prisma.questionImportJob.update({
        where: { id: jobId },
        data: { status: "FAILED", completedAt: new Date() },
      });
      return { success: false, error: "No valid rows to import" };
    }

    await prisma.questionImportJob.update({
      where: { id: jobId },
      data: { status: "PROCESSING" },
    });

    let successCount = 0;

    const result = await prisma.$transaction(
      async (tx) => {
        for (const row of rowsToInsert) {
          const data = row.parsedData!;

          const questionCode = await generateQuestionCode(data.category);

          const tags = data.tags
            ? data.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [];

          await tx.question.create({
            data: {
              questionCode,
              question: data.question,
              explanation: data.explanation || null,
              subject: data.subject,
              category: data.category,
              language: data.language || "en",
              difficulty: data.difficulty as any,
              tags: tags,
              status: "DRAFT",
              version: 1,
              isActive: true,
              createdById: session.user.id,
              options: {
                create: [
                  { optionText: data.optionA, isCorrect: data.correctOption === "A", order: 1 },
                  { optionText: data.optionB, isCorrect: data.correctOption === "B", order: 2 },
                  { optionText: data.optionC, isCorrect: data.correctOption === "C", order: 3 },
                  { optionText: data.optionD, isCorrect: data.correctOption === "D", order: 4 },
                ],
              },
            },
          });
          successCount++;
        }
        return successCount;
      },
      { timeout: 30000 }
    );

    const finalStatus = result === job.totalRows ? "COMPLETED" : "PARTIAL_SUCCESS";

    await prisma.questionImportJob.update({
      where: { id: jobId },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        validRows: successCount,
      },
    });

    await createAuditLog({
      action: "BULK_IMPORT_EXECUTED",
      entityType: "QUESTION",
      entityId: jobId,
      actorId: session.user.id,
      severity: "MEDIUM",
      metadata: { importedCount: successCount, totalRows: job.totalRows },
    });

    revalidatePath("/dashboard/admin/question-bank");
    revalidatePath("/dashboard/admin/question-bank/bulk-import");

    return { success: true, importedCount: successCount };
  } catch (error) {
    console.error("Execute import error:", error);
    await prisma.questionImportJob.update({
      where: { id: jobId },
      data: { status: "FAILED", completedAt: new Date() },
    });
    return { success: false, error: "Failed to execute import" };
  }
}

export async function getImportHistory() {
  try {
    await requireSmeSession();

    const jobs = await prisma.questionImportJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        uploadedBy: { select: { name: true, email: true } },
      },
    });

    return { success: true, jobs };
  } catch (error) {
    return { success: false, error: "Failed to fetch import history" };
  }
}
