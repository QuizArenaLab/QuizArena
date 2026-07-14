import { managementRepository } from "../repositories/management.repository";
import { competitionRepository } from "../repositories/competition.repository";
import { prisma } from "@/lib/prisma";
import {
  toCompetitionConfigDTO,
  toCompetitionEconomicsDTO,
  toCompetitionEligibilityDTO,
  toCompetitionSectionDTO,
  toCompetitionQuestionDTO,
} from "../shared/mappers";
import {
  CompetitionConfigDTO,
  CompetitionEconomicsDTO,
  CompetitionEligibilityDTO,
  CompetitionSectionDTO,
  CompetitionQuestionDTO,
  UpdateCompetitionConfigDTO,
  UpdateCompetitionEconomicsDTO,
  UpdateCompetitionEligibilityDTO,
  CreateCompetitionSectionDTO,
  AddCompetitionQuestionDTO,
} from "../types/dto";

export class ManagementService {
  // ─── Helpers ─────────────────────────────────────────

  private async ensureCompetitionExists(id: string) {
    const competition = await competitionRepository.findById(id);
    if (!competition) throw new Error("Competition not found");
    return competition;
  }

  // ─── Config ──────────────────────────────────────────

  async getConfig(competitionId: string): Promise<CompetitionConfigDTO | null> {
    await this.ensureCompetitionExists(competitionId);
    const config = await managementRepository.getConfig(competitionId);
    return config ? toCompetitionConfigDTO(config) : null;
  }

  async updateConfig(
    competitionId: string,
    data: UpdateCompetitionConfigDTO
  ): Promise<CompetitionConfigDTO> {
    await this.ensureCompetitionExists(competitionId);
    const config = await managementRepository.upsertConfig(competitionId, data);
    return toCompetitionConfigDTO(config);
  }

  // ─── Economics ───────────────────────────────────────

  async getEconomics(competitionId: string): Promise<CompetitionEconomicsDTO | null> {
    await this.ensureCompetitionExists(competitionId);
    const economics = await managementRepository.getEconomics(competitionId);
    return economics ? toCompetitionEconomicsDTO(economics) : null;
  }

  async updateEconomics(
    competitionId: string,
    data: UpdateCompetitionEconomicsDTO
  ): Promise<CompetitionEconomicsDTO> {
    await this.ensureCompetitionExists(competitionId);
    const economics = await managementRepository.upsertEconomics(competitionId, data);
    return toCompetitionEconomicsDTO(economics);
  }

  // ─── Eligibility ────────────────────────────────────

  async getEligibility(competitionId: string): Promise<CompetitionEligibilityDTO | null> {
    await this.ensureCompetitionExists(competitionId);
    const eligibility = await managementRepository.getEligibility(competitionId);
    return eligibility ? toCompetitionEligibilityDTO(eligibility) : null;
  }

  async updateEligibility(
    competitionId: string,
    data: UpdateCompetitionEligibilityDTO
  ): Promise<CompetitionEligibilityDTO> {
    await this.ensureCompetitionExists(competitionId);
    const eligibility = await managementRepository.upsertEligibility(competitionId, data);
    return toCompetitionEligibilityDTO(eligibility);
  }

  // ─── Sections ───────────────────────────────────────

  async getSections(competitionId: string): Promise<CompetitionSectionDTO[]> {
    await this.ensureCompetitionExists(competitionId);
    const sections = await managementRepository.getSections(competitionId);
    return sections.map(toCompetitionSectionDTO);
  }

  async createSection(
    competitionId: string,
    data: CreateCompetitionSectionDTO
  ): Promise<CompetitionSectionDTO> {
    await this.ensureCompetitionExists(competitionId);
    const section = await managementRepository.createSection(competitionId, {
      title: data.title,
      slug: data.slug,
      description: data.description,
      instructions: data.instructions,
      displayOrder: data.displayOrder ?? 0,
      durationMinutes: data.durationMinutes,
      passingMarks: data.passingMarks,
      isMandatory: data.isMandatory ?? true,
      allowNavigation: data.allowNavigation ?? true,
    });
    return toCompetitionSectionDTO(section);
  }

  // ─── Questions ──────────────────────────────────────

  async getQuestions(competitionId: string): Promise<CompetitionQuestionDTO[]> {
    await this.ensureCompetitionExists(competitionId);
    const questions = await managementRepository.getQuestions(competitionId);
    return questions.map(toCompetitionQuestionDTO);
  }

  async addQuestion(
    competitionId: string,
    data: AddCompetitionQuestionDTO
  ): Promise<CompetitionQuestionDTO> {
    const competition = await this.ensureCompetitionExists(competitionId);

    // Atomically add the question and update the competition's denormalized counters
    const marks = data.marks ?? 1;

    const [question] = await prisma.$transaction([
      prisma.competitionQuestion.create({
        data: {
          competition: { connect: { id: competitionId } },
          question: { connect: { id: data.questionId } },
          ...(data.sectionId ? { section: { connect: { id: data.sectionId } } } : {}),
          displayOrder: data.displayOrder ?? 0,
          marks,
          negativeMarks: data.negativeMarks ?? 0,
          isOptional: data.isOptional ?? false,
          isBonus: data.isBonus ?? false,
        },
      }),
      prisma.competition.update({
        where: { id: competitionId },
        data: {
          totalQuestions: competition.totalQuestions + 1,
          maximumMarks: competition.maximumMarks + marks,
        },
      }),
    ]);

    return toCompetitionQuestionDTO(question);
  }
}

export const managementService = new ManagementService();
