import { prisma } from "@/lib/prisma";
import { CompetitionStatus, CompetitionType, ExamCategory, Prisma } from "@/generated/prisma";
import {
  CompetitionWithRelations,
  GetCompetitionsParams,
  ValidationGateResult,
  PublishValidationResult,
} from "../types";
import {
  checkPublishPreconditions,
  validateCompetitionGate,
} from "../validators/competition.publishing";

export class CompetitionService {
  /**
   * Fetch paginated list of competitions with optional filtering
   */
  static async getCompetitions(params: GetCompetitionsParams) {
    const { search, status, type, exam, page = 1, limit = 10 } = params;

    const where: Prisma.CompetitionWhereInput = {
      isLatestVersion: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (type) where.competitionType = type;
    if (exam) where.exam = exam;

    const skip = (page - 1) * limit;

    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { questions: true } },
        },
      }),
      prisma.competition.count({ where }),
    ]);

    return {
      competitions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetch a single competition by ID, including all sub-configurations and relations
   */
  static async getCompetitionById(id: string): Promise<CompetitionWithRelations | null> {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        config: true,
        economics: true,
        eligibility: true,
        sections: {
          orderBy: { displayOrder: "asc" },
        },
        questions: {
          orderBy: { displayOrder: "asc" },
          include: {
            question: true,
          },
        },
      },
    });

    return competition as CompetitionWithRelations | null;
  }

  /**
   * Fetch a single competition by slug
   */
  static async getCompetitionBySlug(slug: string): Promise<CompetitionWithRelations | null> {
    const competition = await prisma.competition.findUnique({
      where: { slug },
      include: {
        config: true,
        economics: true,
        eligibility: true,
        sections: {
          orderBy: { displayOrder: "asc" },
        },
        questions: {
          orderBy: { displayOrder: "asc" },
          include: {
            question: true,
          },
        },
      },
    });

    return competition as CompetitionWithRelations | null;
  }

  /**
   * Fetch audit trail for a competition
   */
  static async getCompetitionAuditTrail(competitionId: string) {
    return prisma.competitionAudit.findMany({
      where: { competitionId },
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Get high-level statistics for the competition dashboard
   */
  static async getCompetitionStats() {
    const [statusCounts, typeCounts, total] = await Promise.all([
      prisma.competition.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: { isLatestVersion: true },
      }),
      prisma.competition.groupBy({
        by: ["competitionType"],
        _count: { _all: true },
        where: { isLatestVersion: true },
      }),
      prisma.competition.count({ where: { isLatestVersion: true } }),
    ]);

    return {
      statusCounts,
      typeCounts,
      total,
    };
  }

  /**
   * Run the validation gate checks for a competition
   */
  static async validateCompetition(id: string): Promise<ValidationGateResult> {
    const competition = await this.getCompetitionById(id);
    if (!competition) {
      return { valid: false, errors: ["Competition not found"], warnings: [] };
    }
    return validateCompetitionGate(competition);
  }

  /**
   * Check all preconditions for publishing a competition
   */
  static async checkPublishPreconditions(id: string): Promise<PublishValidationResult> {
    const competition = await this.getCompetitionById(id);
    if (!competition) {
      return {
        canPublish: false,
        checks: [
          {
            id: "not-found",
            label: "Competition Exists",
            passed: false,
            severity: "error",
            message: "Competition not found",
          },
        ],
      };
    }
    return checkPublishPreconditions(competition);
  }
}
