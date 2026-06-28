import { prisma } from '@/lib/prisma';

export class CompetitionVersionService {
  /**
   * Creates an immutable version snapshot of the competition.
   * Runtime, leaderboard, and certificates should ONLY read from this version.
   */
  async createSnapshot(competitionId: string, actorId?: string): Promise<void> {
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

    if (!competition) throw new Error('Competition not found');

    const nextVersionNumber = competition.lifecycleVersion + 1;

    // Create the version snapshot
    await prisma.competitionVersion.create({
      data: {
        competitionId: competition.id,
        versionNumber: nextVersionNumber,
        competitionSnapshot: JSON.parse(JSON.stringify({
          title: competition.title,
          slug: competition.slug,
          description: competition.description,
          durationMinutes: competition.durationMinutes,
          totalQuestions: competition.totalQuestions,
          maximumMarks: competition.maximumMarks,
          startsAt: competition.startsAt,
          endsAt: competition.endsAt,
          scheduledStart: competition.scheduledStart,
          scheduledEnd: competition.scheduledEnd
        })),
        sectionsSnapshot: JSON.parse(JSON.stringify(competition.sections)),
        questionsSnapshot: JSON.parse(JSON.stringify(competition.questions)),
        rulesSnapshot: JSON.parse(JSON.stringify(competition.config || {})),
        configSnapshot: JSON.parse(JSON.stringify({
          economics: competition.economics || {},
          eligibility: competition.eligibility || {}
        })),
        publishedById: actorId,
        publishedAt: new Date(),
        isActive: true, // Mark this version as the active one
      }
    });

    // Update the competition's current lifecycle version and deactivate old versions
    await prisma.$transaction([
      prisma.competitionVersion.updateMany({
        where: { competitionId: competition.id, versionNumber: { lt: nextVersionNumber } },
        data: { isActive: false }
      }),
      prisma.competition.update({
        where: { id: competition.id },
        data: { lifecycleVersion: nextVersionNumber }
      })
    ]);
  }
}

export const competitionVersion = new CompetitionVersionService();
