// @ts-nocheck
import {
  Competition,
  CompetitionSection,
  CompetitionQuestion,
  CompetitionConfig,
  CompetitionEconomics,
  CompetitionEligibility,
  Question,
} from "@/generated/prisma";
import {
  CompetitionSnapshotDTO,
  SnapshotMetadataDTO,
  SnapshotSectionDTO,
  SnapshotQuestionDTO,
  SnapshotRulesDTO,
  SnapshotConfigDTO,
} from "../types/version.types";

export class SnapshotBuilder {
  /**
   * Transforms mutable Prisma models into pure, immutable snapshot DTOs.
   */
  static buildCompetitionSnapshot(competition: Competition): SnapshotMetadataDTO {
    return {
      title: competition.title,
      slug: competition.slug,
      description: competition.description,
      competitionType: competition.competitionType,
      visibility: competition.visibility,
    };
  }

  static buildSectionsSnapshot(sections: CompetitionSection[]): SnapshotSectionDTO[] {
    return sections
      .map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        instructions: s.instructions,
        displayOrder: s.displayOrder,
        durationMinutes: s.durationMinutes,
        totalQuestions: s.totalQuestions,
        maximumMarks: s.maximumMarks,
        passingMarks: s.passingMarks,
        isMandatory: s.isMandatory,
        allowNavigation: s.allowNavigation,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static buildQuestionsSnapshot(
    compQuestions: (CompetitionQuestion & { question: Question & { options?: any[] } })[]
  ): SnapshotQuestionDTO[] {
    return compQuestions
      .map((cq) => ({
        id: cq.id,
        originalQuestionId: cq.questionId,
        sectionId: cq.sectionId,
        displayOrder: cq.displayOrder,
        sectionOrder: cq.sectionOrder,
        marks: cq.marks,
        negativeMarks: cq.negativeMarks,
        questionWeight: cq.questionWeight,
        difficultyOverride: cq.difficultyOverride,
        timeLimitOverride: cq.timeLimitOverride,
        isOptional: cq.isOptional,
        isBonus: cq.isBonus,
        isMandatory: cq.isMandatory,
        questionContent: {
          questionCode: cq.question.questionCode,
          question: cq.question.question,
          explanation: cq.question.explanation,
          language: cq.question.language,
          tags: cq.question.tags,
          options: cq.question.options || [],
        },
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static buildRulesSnapshot(config: CompetitionConfig | null): SnapshotRulesDTO {
    if (!config) {
      return {
        allowRetries: false,
        negativeMarkingEnabled: false,
        randomizeQuestions: false,
        randomizeOptions: false,
      };
    }
    return {
      allowRetries: config.allowRetake,
      negativeMarkingEnabled: config.negativeMarkingEnabled,
      randomizeQuestions: config.randomizeQuestions,
      randomizeOptions: config.randomizeOptions,
    };
  }

  static buildConfigSnapshot(
    economics: CompetitionEconomics | null,
    eligibility: CompetitionEligibility | null
  ): SnapshotConfigDTO {
    return {
      economics: economics
        ? {
            entryFee: economics.entryFee,
            rewardPool: economics.rewardPool,
            currency: economics.currency,
            metadata: economics.metadata,
          }
        : null,
      eligibility: eligibility
        ? {
            criteria: eligibility.criteria,
            maxParticipants: eligibility.maxParticipants,
          }
        : null,
      certificates: null, // Stub for future expansion
      rewards: null, // Stub for future expansion
    };
  }

  static buildCompleteSnapshot(
    competition: Competition,
    sections: CompetitionSection[],
    questions: (CompetitionQuestion & { question: Question & { options?: any[] } })[],
    config: CompetitionConfig | null,
    economics: CompetitionEconomics | null,
    eligibility: CompetitionEligibility | null
  ): CompetitionSnapshotDTO {
    return {
      metadata: this.buildCompetitionSnapshot(competition),
      sections: this.buildSectionsSnapshot(sections),
      questions: this.buildQuestionsSnapshot(questions),
      rules: this.buildRulesSnapshot(config),
      config: this.buildConfigSnapshot(economics, eligibility),
    };
  }
}
