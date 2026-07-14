import { prisma } from "@/lib/prisma";
import { SessionState } from "@/generated/prisma";

export class ScoringService {
  async evaluateAttempt(attemptId: string) {
    return prisma.$transaction(async (tx) => {
      const attempt = await tx.competitionAttempt.findUnique({
        where: { id: attemptId },
        include: { session: true },
      });

      if (!attempt) throw new Error("Attempt not found");

      // Ensure session is actually submitted
      if (attempt.session.status !== SessionState.SUBMITTED) {
        throw new Error("Cannot grade an attempt that is not submitted.");
      }

      // Prevent duplicate grading
      const existingRecord = await tx.submissionRecord.findUnique({
        where: { attemptId },
      });
      if (existingRecord) {
        return tx.submissionResult.findUnique({ where: { submissionRecordId: existingRecord.id } });
      }

      // Fetch all answers
      const answers = await tx.competitionSessionAnswer.findMany({
        where: { sessionId: attempt.sessionId },
      });

      // Fetch competition scoring rules
      const compQuestions = await tx.competitionQuestion.findMany({
        where: { competitionId: attempt.competitionId },
      });
      const rulesMap = new Map(compQuestions.map((q) => [q.questionId, q]));

      let score = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let unansweredCount = 0;

      for (const compQ of compQuestions) {
        const answer = answers.find((a) => a.questionId === compQ.questionId);

        if (!answer || !answer.selectedOptionId) {
          unansweredCount++;
          continue;
        }

        // Fetch the option to check correctness
        const option = await tx.questionOption.findUnique({
          where: { id: answer.selectedOptionId },
        });

        if (option?.isCorrect) {
          score += compQ.marks;
          correctAnswers++;
        } else {
          score -= compQ.negativeMarks;
          wrongAnswers++;
        }
      }

      const totalQuestions = compQuestions.length;
      const accuracy =
        correctAnswers + wrongAnswers > 0 ? correctAnswers / (correctAnswers + wrongAnswers) : 0;
      const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // 1. Create Submission Record & Result
      const record = await tx.submissionRecord.create({
        data: {
          attemptId,
          userId: attempt.userId,
          result: {
            create: {
              score: Math.round(score),
              accuracy,
              percentage,
              correctAnswers,
              wrongAnswers,
              unansweredCount,
            },
          },
        },
        include: { result: true },
      });

      // 2. Update Leaderboard
      await this.updateLeaderboard(
        tx,
        attempt.competitionId,
        record.result!,
        attempt.userId,
        attempt.timeTakenInSeconds
      );

      return record.result;
    });
  }

  private async updateLeaderboard(
    tx: any,
    competitionId: string,
    result: any,
    userId: string,
    timeTaken: number
  ) {
    const leaderboardKey = `COMPETITION:${competitionId}`;

    // Upsert user's snapshot
    await tx.rankingSnapshot.upsert({
      where: { leaderboardKey_userId: { leaderboardKey, userId } },
      update: {
        score: result.score,
        accuracy: result.accuracy,
        completionTime: timeTaken,
        snapshotTimestamp: new Date(),
      },
      create: {
        leaderboardKey,
        userId,
        rank: 0, // will be recalculated
        score: result.score,
        accuracy: result.accuracy,
        completionTime: timeTaken,
        percentile: 0,
      },
    });

    // Recalculate Ranks
    const allSnapshots = await tx.rankingSnapshot.findMany({
      where: { leaderboardKey },
      orderBy: [{ score: "desc" }, { completionTime: "asc" }],
    });

    let highestScore = 0;
    let sumScore = 0;
    let sumAccuracy = 0;

    for (let i = 0; i < allSnapshots.length; i++) {
      const snap = allSnapshots[i];
      const rank = i + 1;
      const percentile = ((allSnapshots.length - rank) / allSnapshots.length) * 100;

      await tx.rankingSnapshot.update({
        where: { id: snap.id },
        data: { rank, percentile },
      });

      if (snap.score > highestScore) highestScore = snap.score;
      sumScore += snap.score;
      sumAccuracy += snap.accuracy;
    }

    // Update Projection
    const count = allSnapshots.length;
    await tx.leaderboardProjection.upsert({
      where: { leaderboardKey },
      update: {
        participantCount: count,
        highestScore,
        averageScore: count > 0 ? sumScore / count : 0,
        averageAccuracy: count > 0 ? sumAccuracy / count : 0,
      },
      create: {
        leaderboardKey,
        participantCount: count,
        highestScore,
        averageScore: count > 0 ? sumScore / count : 0,
        averageAccuracy: count > 0 ? sumAccuracy / count : 0,
      },
    });
  }
}

export const scoringService = new ScoringService();
