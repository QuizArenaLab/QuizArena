import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { PrismaClient } from "../src/generated/prisma";
import { hashPassword } from "../src/lib/password";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting robust database seed...");
  const password = await hashPassword("password123");

  // 1. Create Core Personas
  const roles = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "USER"];
  const users = await Promise.all(
    roles.map((role) =>
      prisma.user.upsert({
        where: { email: `${role.toLowerCase()}@quizarena.com` },
        update: {},
        create: {
          email: `${role.toLowerCase()}@quizarena.com`,
          password,
          name: `Demo ${role}`,
          role: role as any,
          onboardingCompleted: true,
        },
      })
    )
  );
  console.log(`Created ${users.length} persona accounts (Password: password123)`);

  const adminUser = users.find(u => u.role === "ADMIN")!;
  const candidateUser = users.find(u => u.role === "USER")!;

  // 2. Generate 50 Questions
  console.log("Generating 50 Questions...");
  const questions = [];
  for (let i = 1; i <= 50; i++) {
    const q = await prisma.question.create({
      data: {
        questionCode: `QZ-${1000 + i}`,
        question: `Sample Question ${i} for rigorous testing. What is the expected outcome?`,
        explanation: `Explanation for Sample Question ${i}.`,
        subject: ["Science", "History", "Math", "Tech"][i % 4],
        difficulty: ["BEGINNER", "MEDIUM", "HARDCORE"][i % 3] as any,
        status: "APPROVED",
        marks: 10,
        negativeMarks: 2,
        createdById: adminUser.id,
        options: {
          create: [
            { optionText: `Option A for Q${i}`, isCorrect: true, order: 0 },
            { optionText: `Option B for Q${i}`, isCorrect: false, order: 1 },
            { optionText: `Option C for Q${i}`, isCorrect: false, order: 2 },
            { optionText: `Option D for Q${i}`, isCorrect: false, order: 3 },
          ],
        },
      },
    });
    questions.push(q);
  }

  // 3. Generate 5 Competitions
  console.log("Generating 5 Competitions...");
  const comps = [];
  for (let i = 1; i <= 5; i++) {
    const comp = await prisma.challenge.create({
      data: {
        title: `Mega Competition 2026 - Phase ${i}`,
        slug: `mega-competition-${i}`,
        description: `Comprehensive evaluation phase ${i}.`,
        category: "SSC",
        difficulty: "MEDIUM",
        durationInMinutes: 60,
        totalQuestions: 10,
        status: i === 1 ? "ENDED" : "LIVE",
        createdById: adminUser.id,
      },
    });

    // Attach 10 questions to each
    const compQuestions = questions.slice((i - 1) * 10, i * 10);
    await Promise.all(
      compQuestions.map((q, idx) =>
        prisma.challengeQuestion.create({
          data: { challengeId: comp.id, questionId: q.id, orderIndex: idx },
        })
      )
    );
    comps.push(comp);
  }

  // 4. Generate Leaderboard & Results for Ended Competition
  console.log("Generating Leaderboard & Certificates for Ended Competition...");
  const endedComp = comps[0];
  
  const attempt = await prisma.attempt.create({
    data: {
      userId: candidateUser.id,
      challengeId: endedComp.id,
      status: "EVALUATED",
      score: 85,
      totalAnswered: 10,
      correctAnswers: 9,
      wrongAnswers: 1,
      timeTakenInSeconds: 1200,
      startedAt: new Date(),
      submittedAt: new Date(),
    }
  });

  await prisma.leaderboardEntry.create({
    data: {
      challengeId: endedComp.id,
      userId: candidateUser.id,
      attemptId: attempt.id,
      score: 85,
      rank: 1,
      accuracy: 90.0,
      timeTakenInSeconds: 1200,
    }
  });

  await prisma.certificateSnapshot.create({
    data: {
      userId: candidateUser.id,
      competitionId: endedComp.id,
      certificateType: "WINNER",
      certificateVersion: "1.0",
      issueDate: new Date(),
      verificationToken: randomUUID(),
      participantName: candidateUser.name || "Demo Candidate",
      competitionName: endedComp.title,
      competitionVersion: "1.0",
      rank: 1,
      score: 85,
      completionDate: new Date(),
      qrPayload: "dummy-payload",
      brandAssetsVersion: "1.0",
    }
  });

  console.log("Robust seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
