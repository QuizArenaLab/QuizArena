"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import {
  parseFile,
  validateRows,
  ValidatedRow,
  ImportRow,
} from "@/features/admin/services/question-bank/bulk-import";
import { generateQuestionCode } from "@/features/admin/services/question-bank/question-code";
import { createAuditLog } from "@/features/super-admin/services/audit/index";
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
  previewRows?: ValidatedRow[];
  totalRows?: number;
  validRows?: number;
  warningRows?: number;
  blockedRows?: number;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
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
    const validRows = validatedRows.filter((r) => r.status === "VALID").length;
    const warningRows = validatedRows.filter((r) => r.status === "WARNING").length;
    const blockedRows = validatedRows.filter((r) => r.status === "BLOCKED").length;

    return {
      success: true,
      previewRows: validatedRows,
      totalRows,
      validRows,
      warningRows,
      blockedRows,
      fileName: file.name,
      fileType:
        file.type ||
        (file.name.endsWith(".csv")
          ? "text/csv"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
      fileSize: file.size,
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
  validRows: ValidatedRow[],
  fileMetadata: { fileName: string; fileType: string; fileSize: number }
): Promise<{
  success: boolean;
  jobId?: string;
  error?: string;
}> {
  try {
    const { session } = await requireSmeSession();

    if (validRows.length === 0) {
      return { success: false, error: "No valid rows to import" };
    }

    const job = await prisma.questionImportJob.create({
      data: {
        uploadedById: session.user.id,
        fileName: fileMetadata.fileName,
        fileType: fileMetadata.fileType,
        fileSize: fileMetadata.fileSize,
        totalRows: validRows.length,
        status: "QUEUED",
      },
    });

    // Fire and forget background process
    processImportJobBackground(job.id, validRows, session.user.id).catch(console.error);

    return { success: true, jobId: job.id };
  } catch (error) {
    console.error("Execute import error:", error);
    return { success: false, error: "Failed to initiate import" };
  }
}

async function processImportJobBackground(jobId: string, rows: ValidatedRow[], actorId: string) {
  try {
    await prisma.questionImportJob.update({
      where: { id: jobId },
      data: { status: "RUNNING", startedAt: new Date() },
    });

    const CHUNK_SIZE = 100;
    const totalRows = rows.length;
    let processedRows = 0;
    let successCount = 0;
    let duplicatePrevents = 0;
    let totalHealthScore = 0;
    let highestHealthScore = -1;
    let lowestHealthScore = 101;
    let questionsBelowThreshold = 0;
    let warningsCount = 0;

    for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);

      await prisma.$transaction(
        async (tx) => {
          for (const row of chunk) {
            const data = row.parsedData!;
            const questionCode = await generateQuestionCode(data.category);

            const tags = data.tags
              ? data.tags
                  .split(",")
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [];

            const optionsToCreate = [
              { optionText: data.optionA, isCorrect: data.correctOption === "A", order: 1 },
              { optionText: data.optionB, isCorrect: data.correctOption === "B", order: 2 },
              { optionText: data.optionC, isCorrect: data.correctOption === "C", order: 3 },
              { optionText: data.optionD, isCorrect: data.correctOption === "D", order: 4 },
            ];

            if (data.optionE)
              optionsToCreate.push({
                optionText: data.optionE,
                isCorrect: data.correctOption === "E",
                order: 5,
              });
            if (data.optionF)
              optionsToCreate.push({
                optionText: data.optionF,
                isCorrect: data.correctOption === "F",
                order: 6,
              });

            const healthScore = row.healthScore || 0;
            totalHealthScore += healthScore;
            highestHealthScore = Math.max(highestHealthScore, healthScore);
            lowestHealthScore = Math.min(lowestHealthScore, healthScore);
            if (healthScore < 75) {
              questionsBelowThreshold++;
            }

            const hasErrors = row.issues?.some((i) => i.severity === "ERROR");
            const mappedStatus = healthScore >= 75 && !hasErrors ? "APPROVED" : "REVIEW";
            const isActive = mappedStatus === "APPROVED";

            if (
              row.duplicateCheck?.status === "SIMILAR" ||
              row.duplicateCheck?.status === "EXACT"
            ) {
              duplicatePrevents++;
            }

            const q = await tx.question.create({
              data: {
                questionCode,
                question: data.question,
                explanation: data.explanation || null,
                subject: data.subject,
                topic: data.topic || null,
                category: data.category,
                language: data.language || "en",
                marks: data.marks || 1,
                negativeMarks: data.negativeMarks || 0,
                difficulty: data.difficulty as any,
                tags: tags,
                status: mappedStatus,
                version: 1,
                isActive: isActive,
                healthScore: row.healthScore,
                healthGrade: row.healthGrade,
                healthStatus: row.healthStatus,
                healthLastCalculatedAt: new Date(),
                createdById: actorId,
                options: {
                  create: optionsToCreate,
                },
              },
            });

            // Persist Issues
            if (row.issues && row.issues.length > 0) {
              const issueData = row.issues.map((i) => ({
                importJobId: jobId,
                rowNumber: row.rowNumber,
                severity: i.severity,
                message: i.message,
                suggestedFix: i.suggestedFix,
              }));
              await tx.importIssue.createMany({ data: issueData });
              warningsCount += issueData.filter((i) => i.severity === "WARNING").length;
            }

            successCount++;
          }
        },
        { timeout: 30000 }
      );

      processedRows += chunk.length;
      const progressPercentage = Math.round((processedRows / totalRows) * 100);

      await prisma.questionImportJob.update({
        where: { id: jobId },
        data: {
          progressPercentage,
          processedRows,
        },
      });
    }

    const averageHealthScore = totalRows > 0 ? Math.round(totalHealthScore / totalRows) : 0;
    // Handle edge case if no rows were successful
    if (highestHealthScore === -1) highestHealthScore = 0;
    if (lowestHealthScore === 101) lowestHealthScore = 0;

    await prisma.importReport.create({
      data: {
        jobId,
        duplicatesPrevented: duplicatePrevents,
        totalImported: successCount,
        averageHealthScore,
        highestHealthScore,
        lowestHealthScore,
        questionsBelowThreshold,
        failedRows: totalRows - successCount,
      },
    });

    const job = await prisma.questionImportJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        validRows: successCount,
        warningRows: warningsCount,
        duplicateRows: duplicatePrevents,
        averageHealthScore,
        highestHealthScore,
        lowestHealthScore,
        questionsBelowThreshold,
        progressPercentage: 100,
        processedRows: totalRows,
      },
    });

    await prisma.importAudit.create({
      data: {
        jobId,
        performedById: actorId,
        action: "IMPORT_COMPLETED",
        fileName: job.fileName,
        rowsImported: successCount,
        warningsCount,
        errorsCount: totalRows - successCount,
      },
    });

    await createAuditLog({
      action: "BULK_IMPORT_EXECUTED",
      entityType: "QUESTION",
      entityId: jobId,
      actorId: actorId,
      severity: "MEDIUM",
      metadata: { importedCount: successCount, totalRows },
    });
  } catch (error) {
    console.error("Background processing failed:", error);
    await prisma.questionImportJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        failureReason: error instanceof Error ? error.message : "Unknown error",
      },
    });

    await prisma.importAudit.create({
      data: {
        jobId,
        performedById: actorId,
        action: "IMPORT_FAILED",
        fileName: "unknown",
        rowsImported: 0,
        warningsCount: 0,
        errorsCount: 0,
      },
    });
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

export async function deleteImportHistory(jobId: string) {
  try {
    await requireSmeSession();

    // Validate job exists
    const job = await prisma.questionImportJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { success: false, error: "Import job not found" };
    }

    // Delete the record
    await prisma.questionImportJob.delete({
      where: { id: jobId },
    });

    revalidatePath("/dashboard/admin/question-bank");
    revalidatePath("/dashboard/admin/questions/import");

    return { success: true };
  } catch (error) {
    console.error("Delete import history error:", error);
    return { success: false, error: "Failed to delete import history" };
  }
}

export async function getImportJobStatus(jobId: string) {
  try {
    const job = await prisma.questionImportJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        progressPercentage: true,
        processedRows: true,
        totalRows: true,
        validRows: true,
        warningRows: true,
        duplicateRows: true,
        failureReason: true,
      },
    });
    if (!job) return { success: false, error: "Job not found" };
    return { success: true, job };
  } catch (error) {
    return { success: false, error: "Failed to fetch job status" };
  }
}
