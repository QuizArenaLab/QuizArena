// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { WizardDraftData } from "@/features/admin/competition/wizard/types/wizard.types";

export interface IntelligenceReport {
  healthScore: number; // 0 to 100
  totalQuestions: number;
  totalMarks: number;
  difficultySplit: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
  warnings: string[];
  recommendations: string[];
}

export class AssessmentAnalyticsService {
  /**
   * Analyzes the current composer draft state and returns a heuristic intelligence report.
   */
  async analyzeDraft(draftData: WizardDraftData): Promise<IntelligenceReport> {
    const report: IntelligenceReport = {
      healthScore: 100,
      totalQuestions: 0,
      totalMarks: 0,
      difficultySplit: { EASY: 0, MEDIUM: 0, HARD: 0 },
      warnings: [],
      recommendations: [],
    };

    if (!draftData.composer?.sections || draftData.composer.sections.length === 0) {
      report.healthScore = 0;
      report.warnings.push("No sections found in the assessment.");
      return report;
    }

    // Collect all unique question IDs
    const questionIds = new Set<string>();
    for (const section of draftData.composer.sections) {
      if (section.questions) {
        for (const q of section.questions) {
          questionIds.add(q.questionId);
          report.totalQuestions++;
          report.totalMarks += q.marks || 1;
        }
      }
    }

    if (report.totalQuestions === 0) {
      report.healthScore = 20;
      report.warnings.push("Assessment has sections but no questions.");
      return report;
    }

    // Fetch question metadata from DB
    const questions = await prisma.question.findMany({
      where: { id: { in: Array.from(questionIds) } },
      select: { id: true, difficulty: true },
    });

    // Calculate Difficulty Split
    for (const q of questions) {
      if (q.difficulty === "BEGINNER") report.difficultySplit.EASY++;
      else if (q.difficulty === "MEDIUM") report.difficultySplit.MEDIUM++;
      else if (q.difficulty === "HARDCORE") report.difficultySplit.HARD++;
    }

    // Heuristics Evaluation
    const easyRatio = report.difficultySplit.EASY / report.totalQuestions;
    const hardRatio = report.difficultySplit.HARD / report.totalQuestions;

    if (hardRatio > 0.5) {
      report.healthScore -= 15;
      report.warnings.push("Too many HARD questions. Consider balancing the difficulty.");
    }
    if (easyRatio > 0.6) {
      report.healthScore -= 10;
      report.recommendations.push("High number of EASY questions. Consider adding more challenge.");
    }

    const targetMarks = draftData.config?.maximumMarks || 0;
    if (targetMarks > 0 && report.totalMarks !== targetMarks) {
      report.healthScore -= 20;
      report.warnings.push(
        `Total marks configured (${targetMarks}) does not match question marks (${report.totalMarks}).`
      );
    }

    if (report.totalQuestions < 5) {
      report.healthScore -= 10;
      report.recommendations.push("Assessment is very short. Consider adding more questions.");
    }

    // Clamp health score between 0 and 100
    report.healthScore = Math.max(0, Math.min(100, report.healthScore));

    return report;
  }
}
