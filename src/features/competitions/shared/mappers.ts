import {
  Competition,
  CompetitionConfig,
  CompetitionEconomics,
  CompetitionEligibility,
  CompetitionSection,
  CompetitionQuestion,
  CompetitionSchedule,
  CompetitionLifecycleAudit,
} from "@/generated/prisma";
import {
  CompetitionDTO,
  CompetitionConfigDTO,
  CompetitionEconomicsDTO,
  CompetitionEligibilityDTO,
  CompetitionSectionDTO,
  CompetitionQuestionDTO,
  CompetitionScheduleDTO,
  CompetitionLifecycleAuditDTO,
} from "../types/dto";

export function toCompetitionDTO(competition: Competition): CompetitionDTO {
  return {
    id: competition.id,
    title: competition.title,
    slug: competition.slug,
    description: competition.description,
    competitionType: competition.competitionType,
    status: competition.status,
    lifecycleState: competition.lifecycleState,
    visibility: competition.visibility,
    exam: competition.exam,
    difficulty: competition.difficulty,
    durationMinutes: competition.durationMinutes,
    totalQuestions: competition.totalQuestions,
    maximumMarks: competition.maximumMarks,
    startsAt: competition.startsAt,
    endsAt: competition.endsAt,
    createdAt: competition.createdAt,
    updatedAt: competition.updatedAt,
  };
}

// ─── Management Mappers ─────────────────────────────

export function toCompetitionConfigDTO(
  config: CompetitionConfig
): CompetitionConfigDTO {
  return {
    id: config.id,
    competitionId: config.competitionId,
    negativeMarkingEnabled: config.negativeMarkingEnabled,
    negativeMarkPerQuestion: config.negativeMarkPerQuestion,
    passingMarks: config.passingMarks,
    allowRetake: config.allowRetake,
    randomizeQuestions: config.randomizeQuestions,
    randomizeOptions: config.randomizeOptions,
  };
}

export function toCompetitionEconomicsDTO(
  economics: CompetitionEconomics
): CompetitionEconomicsDTO {
  return {
    id: economics.id,
    competitionId: economics.competitionId,
    entryFee: economics.entryFee,
    rewardPool: economics.rewardPool,
    currency: economics.currency,
  };
}

export function toCompetitionEligibilityDTO(
  eligibility: CompetitionEligibility
): CompetitionEligibilityDTO {
  return {
    id: eligibility.id,
    competitionId: eligibility.competitionId,
    maxParticipants: eligibility.maxParticipants,
  };
}

export function toCompetitionSectionDTO(
  section: CompetitionSection
): CompetitionSectionDTO {
  return {
    id: section.id,
    competitionId: section.competitionId,
    title: section.title,
    slug: section.slug,
    description: section.description,
    instructions: section.instructions,
    displayOrder: section.displayOrder,
    durationMinutes: section.durationMinutes,
    totalQuestions: section.totalQuestions,
    maximumMarks: section.maximumMarks,
    passingMarks: section.passingMarks,
    isMandatory: section.isMandatory,
    allowNavigation: section.allowNavigation,
  };
}

export function toCompetitionQuestionDTO(
  question: CompetitionQuestion
): CompetitionQuestionDTO {
  return {
    id: question.id,
    competitionId: question.competitionId,
    questionId: question.questionId,
    sectionId: question.sectionId,
    displayOrder: question.displayOrder,
    sectionOrder: question.sectionOrder,
    marks: question.marks,
    negativeMarks: question.negativeMarks,
    questionWeight: question.questionWeight,
    isOptional: question.isOptional,
    isBonus: question.isBonus,
    isMandatory: question.isMandatory,
  };
}

// ─── Lifecycle & Scheduling Mappers ──────────────────

export function toScheduleDTO(
  schedule: CompetitionSchedule
): CompetitionScheduleDTO {
  return {
    id: schedule.id,
    competitionId: schedule.competitionId,
    publishAt: schedule.publishAt,
    expiresAt: schedule.expiresAt,
    timezone: schedule.timezone,
    status: schedule.status,
    executedAt: schedule.executedAt,
    executionLog: schedule.executionLog,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}

export function toLifecycleAuditDTO(
  audit: CompetitionLifecycleAudit
): CompetitionLifecycleAuditDTO {
  return {
    id: audit.id,
    competitionId: audit.competitionId,
    previousState: audit.previousState,
    newState: audit.newState,
    reason: audit.reason,
    performedBy: audit.performedBy,
    performedByType: audit.performedByType,
    createdAt: audit.createdAt,
  };
}
