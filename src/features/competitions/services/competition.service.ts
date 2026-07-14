import { competitionRepository } from "../repositories/competition.repository";
import { toCompetitionDTO } from "../shared/mappers";
import { CreateCompetitionDTO, UpdateCompetitionDTO, CompetitionDTO } from "../types/dto";
import { CompetitionLifecycle, CompetitionStatus } from "@/generated/prisma";

export class CompetitionService {
  async createCompetition(data: CreateCompetitionDTO, userId?: string): Promise<CompetitionDTO> {
    const existing = await competitionRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error("Competition with this slug already exists");
    }

    const competition = await competitionRepository.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      competitionType: data.competitionType,
      durationMinutes: data.durationMinutes,
      exam: data.exam,
      difficulty: data.difficulty,
      visibility: data.visibility,
      status: CompetitionStatus.INACTIVE,
      lifecycleState: CompetitionLifecycle.DRAFT,
      ...(userId ? { createdBy: { connect: { id: userId } } } : {}),
    });

    return toCompetitionDTO(competition);
  }

  async getCompetitionById(id: string): Promise<CompetitionDTO | null> {
    const competition = await competitionRepository.findById(id);
    if (!competition) return null;
    return toCompetitionDTO(competition);
  }

  async getCompetitions(
    page: number,
    limit: number
  ): Promise<{ data: CompetitionDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const [competitions, total] = await competitionRepository.findAll({ skip, take: limit });
    return {
      data: competitions.map(toCompetitionDTO),
      total,
    };
  }

  async updateCompetition(id: string, data: UpdateCompetitionDTO): Promise<CompetitionDTO> {
    const competition = await competitionRepository.findById(id);
    if (!competition) throw new Error("Competition not found");

    if (data.slug && data.slug !== competition.slug) {
      const existing = await competitionRepository.findBySlug(data.slug);
      if (existing) throw new Error("Slug is already in use");
    }

    const updated = await competitionRepository.update(id, data);
    return toCompetitionDTO(updated);
  }

  async publishCompetition(id: string): Promise<CompetitionDTO> {
    const competition = await competitionRepository.findById(id);
    if (!competition) throw new Error("Competition not found");

    if (competition.lifecycleState === CompetitionLifecycle.LIVE) {
      throw new Error("Competition is already published");
    }

    if (!competition.durationMinutes) {
      throw new Error("Cannot publish competition without duration configured");
    }

    const updated = await competitionRepository.update(id, {
      lifecycleState: CompetitionLifecycle.LIVE,
      status: CompetitionStatus.ACTIVE,
      publishedAt: new Date(),
    });

    return toCompetitionDTO(updated);
  }
}

export const competitionService = new CompetitionService();
