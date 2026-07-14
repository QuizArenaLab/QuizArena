import { prisma } from '@/lib/prisma';
import { Competition, Prisma } from '@/generated/prisma';

export class CompetitionRepository {
  async create(data: Prisma.CompetitionCreateInput): Promise<Competition> {
    return prisma.competition.create({ data });
  }

  async findById(id: string): Promise<Competition | null> {
    return prisma.competition.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Competition | null> {
    return prisma.competition.findUnique({
      where: { slug },
    });
  }

  async findAll(params: { skip?: number; take?: number }): Promise<[Competition[], number]> {
    return prisma.$transaction([
      prisma.competition.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.competition.count(),
    ]);
  }

  async update(id: string, data: Prisma.CompetitionUpdateInput): Promise<Competition> {
    return prisma.competition.update({
      where: { id },
      data,
    });
  }
}

export const competitionRepository = new CompetitionRepository();
