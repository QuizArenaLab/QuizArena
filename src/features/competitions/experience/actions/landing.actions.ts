"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { checkEligibility } from "../services/eligibility.service";

export async function getCompetitionLanding(slug: string) {
  const competition = await prisma.competition.findUnique({
    where: { slug },
    include: {
      config: true,
      sections: true,
      schedule: true,
    },
  });
  return competition;
}

export type EligibilityDetail = {
  requirement: string;
  status: "ELIGIBLE" | "NOT_ELIGIBLE" | "PENDING";
  message?: string;
};

export async function getEligibilityStatus(slug: string) {
  const session = await auth();
  const details: EligibilityDetail[] = [];
  
  // 1. Logged In
  if (session?.user?.id) {
    details.push({ requirement: "Logged In", status: "ELIGIBLE" });
  } else {
    details.push({ requirement: "Logged In", status: "NOT_ELIGIBLE", message: "You must log in to participate." });
  }

  const competition = await prisma.competition.findUnique({
    where: { slug },
    include: { schedule: true },
  });

  if (!competition) {
    return { isEligible: false, details };
  }

  // 2. Competition Live
  if (competition.status === "LIVE") {
    details.push({ requirement: "Competition Live", status: "ELIGIBLE" });
  } else {
    details.push({ requirement: "Competition Live", status: "NOT_ELIGIBLE", message: `Status is ${competition.status}` });
  }

  // 3. Time bounds
  const now = new Date();
  if (competition.startsAt && now < competition.startsAt) {
    details.push({ requirement: "Competition Available", status: "NOT_ELIGIBLE", message: "Has not started yet." });
  } else if (competition.endsAt && now > competition.endsAt) {
    details.push({ requirement: "Competition Available", status: "NOT_ELIGIBLE", message: "Has already ended." });
  } else {
    details.push({ requirement: "Competition Available", status: "ELIGIBLE" });
  }

  // 4. Attempts Remaining
  if (session?.user?.id) {
    const existingSession = await prisma.competitionSession.findUnique({
      where: {
        userId_competitionId: {
          userId: session.user.id,
          competitionId: competition.id,
        },
      },
    });

    if (existingSession && ["SUBMITTED", "EXPIRED", "ABANDONED"].includes(existingSession.status)) {
      details.push({ requirement: "Attempts Remaining", status: "NOT_ELIGIBLE", message: "You have already completed this." });
    } else {
      details.push({ requirement: "Attempts Remaining", status: "ELIGIBLE" });
    }
  }

  const isEligible = details.every(d => d.status === "ELIGIBLE");

  return { isEligible, details, competitionId: competition.id };
}

export async function getLeaderboardPreview(slug: string) {
  const session = await auth();
  const competition = await prisma.competition.findUnique({ where: { slug } });
  
  if (!competition) return { topEntries: [], userEntry: null };

  return {
    topEntries: [] as any[], // MOCKED for now since scoring engine isn't fully linked
    userEntry: null as { rank: number; score: number } | null,
  };
}

export async function getCompetitionRewards(slug: string) {
  const competition = await prisma.competition.findUnique({
    where: { slug },
    include: { economics: true }
  });

  if (!competition || !competition.economics) return null;

  return competition.economics;
}

export async function getCompetitionRules(slug: string) {
  const competition = await prisma.competition.findUnique({
    where: { slug },
    include: { config: true }
  });

  if (!competition || !competition.config) return [];

  const config = competition.config;
  const rules = [];

  if (competition.durationMinutes > 0) rules.push(`Duration: ${competition.durationMinutes} minutes`);
  if (config.negativeMarkingEnabled) rules.push(`Negative Marking: -${config.negativeMarkPerQuestion} per wrong answer`);
  if (config.passingMarks) rules.push(`Passing Marks: ${config.passingMarks}`);
  rules.push(config.allowRetake ? "Retakes allowed" : "Single attempt only");
  if (config.randomizeQuestions) rules.push("Question order is randomized");
  if (config.randomizeOptions) rules.push("Options are randomized");

  return rules;
}

export async function getCompetitionInsights(slug: string) {
  const competition = await prisma.competition.findUnique({ where: { slug } });
  if (!competition) return null;

  return {
    estimatedTime: `${competition.durationMinutes} minutes`,
    recommendedSkillLevel: competition.difficulty,
    difficultyDistribution: "Mixed",
    successRate: "TBD",
    averageCompletionRate: "TBD"
  };
}

export async function getRecommendations(slug: string) {
  return [
    { reason: "Matches your selected preparation level" },
    { reason: "Similar difficulty to your recent attempts" }
  ];
}

export async function prepareCompetitionSession(slug: string) {
  const eligibility = await checkEligibility(slug);
  if (!eligibility.success || !eligibility.data) {
    return { success: false, error: eligibility.error };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  // Generate or resume session
  let compSession = await prisma.competitionSession.findUnique({
    where: {
      userId_competitionId: {
        userId: session.user.id,
        competitionId: eligibility.data.competitionId
      }
    }
  });

  if (!compSession) {
    compSession = await prisma.competitionSession.create({
      data: {
        userId: session.user.id,
        competitionId: eligibility.data.competitionId,
        status: "INITIALIZING",
        shuffleSeed: Math.random().toString(36).substring(7)
      }
    });
  }

  return { success: true, sessionId: compSession.id };
}

export async function getUserSessionState(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const competition = await prisma.competition.findUnique({ where: { slug }});
  if (!competition) return null;

  const compSession = await prisma.competitionSession.findUnique({
    where: {
      userId_competitionId: {
        userId: session.user.id,
        competitionId: competition.id
      }
    }
  });

  return compSession;
}
