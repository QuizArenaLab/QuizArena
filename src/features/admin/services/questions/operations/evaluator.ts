import { prisma } from "@/lib/prisma";
import type { OperationalRuleConfig, DetectedIssue } from "./types";
import { OperationalIssueSeverity } from "@/generated/prisma";
import { checkForDuplicates } from "@/features/admin/services/question-bank/duplicate-detection";

/**
 * Background Operations Evaluator
 * Reads OperationalRule configurations from DB.
 * Scans active questions and returns an array of DetectedIssues.
 * Does NOT interact with OperationalIssue directly (separated responsibility).
 */
export async function evaluateQuestions(): Promise<DetectedIssue[]> {
  // Fetch active rules
  const rules = await prisma.operationalRule.findMany({
    where: { enabled: true },
  });
  
  const rulesMap = rules.reduce((acc, rule) => {
    acc[rule.ruleKey] = rule;
    return acc;
  }, {} as Record<string, OperationalRuleConfig>);

  const detectedIssues: DetectedIssue[] = [];

  // MISSING_EXPLANATION
  if (rulesMap["MISSING_EXPLANATION"]) {
    const questions = await prisma.question.findMany({
      where: {
        isActive: true,
        OR: [{ explanation: null }, { explanation: "" }],
      },
      select: { id: true },
    });
    for (const q of questions) {
      detectedIssues.push({
        questionId: q.id,
        issueType: "MISSING_EXPLANATION",
        severity: rulesMap["MISSING_EXPLANATION"].severity,
      });
    }
  }

  // MISSING_TOPIC
  if (rulesMap["MISSING_TOPIC"]) {
    const questions = await prisma.question.findMany({
      where: { isActive: true, topic: null },
      select: { id: true },
    });
    for (const q of questions) {
      detectedIssues.push({
        questionId: q.id,
        issueType: "MISSING_TOPIC",
        severity: rulesMap["MISSING_TOPIC"].severity,
      });
    }
  }

  // HIGH_REPORTS
  if (rulesMap["HIGH_REPORTS"]) {
    const stats = await prisma.questionUsageStats.findMany({
      where: { reportCount: { gte: rulesMap["HIGH_REPORTS"].threshold } },
      select: { questionId: true },
    });
    for (const s of stats) {
      detectedIssues.push({
        questionId: s.questionId,
        issueType: "HIGH_REPORTS",
        severity: rulesMap["HIGH_REPORTS"].severity,
      });
    }
  }

  // LOW_CONFIDENCE
  if (rulesMap["LOW_CONFIDENCE"]) {
    const stats = await prisma.questionUsageStats.findMany({
      where: { dataQuality: "LOW", timesAttempted: { gte: rulesMap["LOW_CONFIDENCE"].threshold } },
      select: { questionId: true },
    });
    for (const s of stats) {
      detectedIssues.push({
        questionId: s.questionId,
        issueType: "LOW_CONFIDENCE",
        severity: rulesMap["LOW_CONFIDENCE"].severity,
      });
    }
  }

  // UNUSED
  if (rulesMap["UNUSED"]) {
    const cutoffDate = new Date(Date.now() - rulesMap["UNUSED"].threshold * 86400000);
    const stats = await prisma.questionUsageStats.findMany({
      where: {
        OR: [
          { lastServedAt: null, timesAttempted: { gt: 0 } },
          { lastServedAt: { lt: cutoffDate } }
        ],
        question: { isActive: true },
      },
      select: { questionId: true },
    });
    for (const s of stats) {
      detectedIssues.push({
        questionId: s.questionId,
        issueType: "UNUSED",
        severity: rulesMap["UNUSED"].severity,
      });
    }
  }

  // OUTDATED (Only DYNAMIC questions)
  if (rulesMap["OUTDATED"]) {
    const cutoffDate = new Date(Date.now() - rulesMap["OUTDATED"].threshold * 86400000);
    const questions = await prisma.question.findMany({
      where: {
        isActive: true,
        questionCategory: "DYNAMIC",
        createdAt: { lt: cutoffDate },
        updatedAt: { lt: cutoffDate },
      },
      select: { id: true },
    });
    for (const q of questions) {
      detectedIssues.push({
        questionId: q.id,
        issueType: "OUTDATED",
        severity: rulesMap["OUTDATED"].severity,
      });
    }
  }

  // NO_ATTEMPTS
  if (rulesMap["NO_ATTEMPTS"]) {
    const stats = await prisma.questionUsageStats.findMany({
      where: {
        timesServed: { gte: rulesMap["NO_ATTEMPTS"].threshold },
        timesAttempted: 0,
      },
      select: { questionId: true },
    });
    for (const s of stats) {
      detectedIssues.push({
        questionId: s.questionId,
        issueType: "NO_ATTEMPTS",
        severity: rulesMap["NO_ATTEMPTS"].severity,
      });
    }
  }

  // DUPLICATE_CANDIDATE
  if (rulesMap["DUPLICATE_CANDIDATE"]) {
    // Only scan questions updated recently based on threshold (e.g. 7 days)
    const cutoffDate = new Date(Date.now() - rulesMap["DUPLICATE_CANDIDATE"].threshold * 86400000);
    const recentlyUpdated = await prisma.question.findMany({
      where: { isActive: true, updatedAt: { gte: cutoffDate } },
      select: { id: true, question: true, category: true, subject: true, explanation: true, options: true },
    });
    
    for (const q of recentlyUpdated) {
      const dupCheck = await checkForDuplicates({
        question: q.question,
        category: q.category ?? "",
        subject: q.subject ?? "",
        explanation: q.explanation ?? "",
        options: q.options,
      });
      
      if (dupCheck.status === "EXACT" || dupCheck.status === "SIMILAR") {
        detectedIssues.push({
          questionId: q.id,
          issueType: "DUPLICATE_CANDIDATE",
          severity: rulesMap["DUPLICATE_CANDIDATE"].severity,
          details: { candidates: dupCheck.candidates.map(c => c.id) }
        });
      }
    }
  }

  return detectedIssues;
}
