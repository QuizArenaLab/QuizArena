import { prisma } from "@/lib/prisma";
import { SessionState, RegistrationState } from "@/generated/prisma";

export class SessionService {
  async startSession(userId: string, competitionId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Validate Registration
      const registration = await tx.registration.findUnique({
        where: { userId_competitionId: { userId, competitionId } },
      });

      if (!registration || registration.state !== RegistrationState.ENROLLED) {
        throw new Error("User is not enrolled in this competition.");
      }

      // 2. Ensure no existing active session
      const existingSession = await tx.competitionSession.findUnique({
        where: { userId_competitionId: { userId, competitionId } },
      });

      if (
        existingSession &&
        (existingSession.status === SessionState.IN_PROGRESS ||
          existingSession.status === SessionState.SUBMITTED)
      ) {
        return existingSession; // Return existing if already started or submitted
      }

      // 3. Get Competition Duration
      const competition = await tx.competition.findUnique({
        where: { id: competitionId },
        select: { durationMinutes: true },
      });

      if (!competition) throw new Error("Competition not found");

      // 4. Calculate Expiry
      const now = new Date();
      const expiresAt = new Date(now.getTime() + competition.durationMinutes * 60000);

      // 5. Create Session
      return tx.competitionSession.upsert({
        where: { userId_competitionId: { userId, competitionId } },
        update: {
          status: SessionState.IN_PROGRESS,
          startedAt: now,
          expiresAt,
        },
        create: {
          userId,
          competitionId,
          status: SessionState.IN_PROGRESS,
          startedAt: now,
          expiresAt,
          shuffleSeed: Math.random().toString(36).substring(7),
        },
      });
    });
  }

  async getSessionState(userId: string, competitionId: string) {
    const session = await prisma.competitionSession.findUnique({
      where: { userId_competitionId: { userId, competitionId } },
      include: {
        answers: true,
        competition: {
          include: {
            sections: {
              orderBy: { displayOrder: "asc" },
              include: {
                questions: {
                  orderBy: { displayOrder: "asc" },
                  include: { question: true },
                },
              },
            },
          },
        },
      },
    });

    if (!session) throw new Error("Session not found");

    // If session has expired but not submitted, auto-submit
    if (
      session.status === SessionState.IN_PROGRESS &&
      session.expiresAt &&
      session.expiresAt < new Date()
    ) {
      await this.submitSession(session.id);
      session.status = SessionState.SUBMITTED;
    }

    return session;
  }

  async submitAnswer(sessionId: string, questionId: string, selectedOptionId: string | null) {
    const session = await prisma.competitionSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new Error("Session not found");

    if (session.status !== SessionState.IN_PROGRESS) {
      throw new Error("Session is not in progress");
    }

    if (session.expiresAt && session.expiresAt < new Date()) {
      throw new Error("Session has expired");
    }

    return prisma.competitionSessionAnswer.upsert({
      where: { sessionId_questionId: { sessionId, questionId } },
      update: { selectedOptionId, answeredAt: new Date() },
      create: {
        sessionId,
        questionId,
        selectedOptionId,
        answeredAt: new Date(),
      },
    });
  }

  async submitSession(sessionId: string) {
    return prisma.$transaction(async (tx) => {
      const session = await tx.competitionSession.findUnique({ where: { id: sessionId } });
      if (!session) throw new Error("Session not found");
      if (session.status === SessionState.SUBMITTED) return session;

      const now = new Date();
      const timeTakenInSeconds = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);

      await tx.competitionSession.update({
        where: { id: sessionId },
        data: { status: SessionState.SUBMITTED },
      });

      await tx.competitionAttempt.upsert({
        where: { sessionId },
        update: { timeTakenInSeconds },
        create: {
          sessionId,
          competitionId: session.competitionId,
          userId: session.userId,
          timeTakenInSeconds,
        },
      });

      return session;
    });
  }
}

export const sessionService = new SessionService();
