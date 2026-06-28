import { prisma } from '@/lib/prisma';
import { CompetitionLifecycle } from '@/generated/prisma';

export interface ReadinessItem {
  key: string;
  label: string;
  passed: boolean;
  score: number;
}

export interface ReadinessResult {
  score: number;
  isReady: boolean;
  checklist: ReadinessItem[];
  errors: string[];
}

export class CompetitionReadinessService {
  async evaluateReadiness(competitionId: string): Promise<ReadinessResult> {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        questions: true,
        sections: true,
        config: true,
        economics: true,
        eligibility: true
      }
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    const checklist: ReadinessItem[] = [];
    let scoreTotal = 0;
    
    // 1. Questions Check (e.g. 25% weight)
    const hasQuestions = competition.questions.length > 0;
    const questionsValid = competition.questions.every(q => !q.isOptional || q.marks > 0); // Simplified check
    const questionsScore = hasQuestions && questionsValid ? 25 : 0;
    checklist.push({ key: 'questions', label: 'Questions Configured', passed: hasQuestions && questionsValid, score: questionsScore });
    scoreTotal += questionsScore;

    // 2. Configuration Check (e.g. 25% weight)
    const hasConfig = !!competition.config;
    const configScore = hasConfig ? 25 : 0;
    checklist.push({ key: 'config', label: 'Runtime Configuration', passed: hasConfig, score: configScore });
    scoreTotal += configScore;

    // 3. Sections Check (e.g. 10% weight)
    const hasSections = competition.sections.length > 0;
    const sectionsScore = hasSections ? 10 : 0;
    checklist.push({ key: 'sections', label: 'Sections Configured', passed: hasSections, score: sectionsScore });
    scoreTotal += sectionsScore;

    // 4. Eligibility Check (e.g. 20% weight)
    const hasEligibility = !!competition.eligibility;
    const eligibilityScore = hasEligibility ? 20 : 0;
    checklist.push({ key: 'eligibility', label: 'Eligibility Configured', passed: hasEligibility, score: eligibilityScore });
    scoreTotal += eligibilityScore;

    // 5. Scheduling Check (e.g. 20% weight)
    const hasSchedule = !!competition.scheduledStart && !!competition.scheduledEnd;
    const scheduleScore = hasSchedule ? 20 : 0;
    checklist.push({ key: 'schedule', label: 'Schedule Configured', passed: hasSchedule, score: scheduleScore });
    scoreTotal += scheduleScore;

    const isReady = scoreTotal >= 100; // Require 100% to publish
    const errors = checklist.filter(c => !c.passed).map(c => c.label + ' is missing or invalid.');

    // Save the readiness score
    await prisma.competition.update({
      where: { id: competitionId },
      data: { readinessScore: scoreTotal }
    });

    return {
      score: scoreTotal,
      isReady,
      checklist,
      errors
    };
  }
}

export const competitionReadiness = new CompetitionReadinessService();
