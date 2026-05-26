import { loadEnvConfig } from "@next/env";

// Load environment variables
loadEnvConfig(process.cwd());

import { PrismaClient } from "../src/generated/prisma";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const hashedPassword = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: "QuizArena Admin",
        onboardingCompleted: true,
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: "QuizArena Admin",
        role: "ADMIN",
        onboardingCompleted: true,
      },
    });
    console.log(`Admin user created: ${adminEmail} with role ADMIN`);
  }

  const questions = [
    {
      question: "What is the capital of India?",
      explanation: "New Delhi is the capital of India since 1911.",
      subject: "General Awareness",
      difficulty: "BEGINNER",
      status: "APPROVED",
      options: [
        { optionText: "Mumbai", isCorrect: false, order: 0 },
        { optionText: "New Delhi", isCorrect: true, order: 1 },
        { optionText: "Kolkata", isCorrect: false, order: 2 },
        { optionText: "Chennai", isCorrect: false, order: 3 },
      ],
    },
    {
      question: "Which planet is known as the Red Planet?",
      explanation: "Mars appears red due to iron oxide on its surface.",
      subject: "General Science",
      difficulty: "BEGINNER",
      status: "APPROVED",
      options: [
        { optionText: "Venus", isCorrect: false, order: 0 },
        { optionText: "Mars", isCorrect: true, order: 1 },
        { optionText: "Jupiter", isCorrect: false, order: 2 },
        { optionText: "Saturn", isCorrect: false, order: 3 },
      ],
    },
    {
      question: "What is the largest mammal in the world?",
      explanation: "Blue whales can grow up to 100 feet in length.",
      subject: "General Science",
      difficulty: "BEGINNER",
      status: "APPROVED",
      options: [
        { optionText: "African Elephant", isCorrect: false, order: 0 },
        { optionText: "Blue Whale", isCorrect: true, order: 1 },
        { optionText: "Giraffe", isCorrect: false, order: 2 },
        { optionText: "Polar Bear", isCorrect: false, order: 3 },
      ],
    },
    {
      question: "In which year did India gain independence?",
      explanation: "India gained independence on August 15, 1947.",
      subject: "General Awareness",
      difficulty: "BEGINNER",
      status: "APPROVED",
      options: [
        { optionText: "1945", isCorrect: false, order: 0 },
        { optionText: "1946", isCorrect: false, order: 1 },
        { optionText: "1947", isCorrect: true, order: 2 },
        { optionText: "1948", isCorrect: false, order: 3 },
      ],
    },
    {
      question: "What is 15% of 200?",
      explanation: "15% of 200 = (15/100) × 200 = 30",
      subject: "Quantitative Aptitude",
      difficulty: "BEGINNER",
      status: "APPROVED",
      options: [
        { optionText: "25", isCorrect: false, order: 0 },
        { optionText: "30", isCorrect: true, order: 1 },
        { optionText: "35", isCorrect: false, order: 2 },
        { optionText: "40", isCorrect: false, order: 3 },
      ],
    },
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        question: q.question,
        explanation: q.explanation,
        subject: q.subject,
        difficulty: q.difficulty as "BEGINNER" | "MEDIUM" | "HARDCORE",
        status: q.status as "DRAFT" | "REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED",
        marks: 1,
        negativeMarks: 0.25,
        options: {
          create: q.options,
        },
      },
    });
  }
  console.log("Questions seeded successfully!");

  const user = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (user) {
    const challenge = await prisma.challenge.create({
      data: {
        title: "Daily Challenge - General Knowledge",
        slug: "daily-challenge-general",
        description: "Test your general knowledge with this challenge",
        category: "SSC",
        difficulty: "MEDIUM",
        durationInMinutes: 20,
        totalQuestions: 5,
        status: "LIVE",
        createdById: user.id,
      },
    });

    const allQuestions = await prisma.question.findMany({
      take: 5,
      select: { id: true },
    });

    await Promise.all(
      allQuestions.map((q, index) =>
        prisma.challengeQuestion.create({
          data: {
            challengeId: challenge.id,
            questionId: q.id,
            order: index + 1,
          },
        })
      )
    );
    console.log("Challenge seeded successfully!");
  }

  // ─── Seed Default Platform Settings ─────────────────────────
  const defaultSettings = [
    // General
    {
      key: "platform.name",
      value: "QuizArena",
      category: "general",
      description: "The display name of the platform shown across the UI",
      isProtected: false,
    },
    {
      key: "platform.description",
      value: "AI-powered quiz platform for competitive exam preparation",
      category: "general",
      description: "Platform description used in SEO and marketing",
      isProtected: false,
    },
    {
      key: "platform.logo_url",
      value: "/logo.png",
      category: "general",
      description: "URL path to the platform logo",
      isProtected: false,
    },
    // Challenges
    {
      key: "challenges.submissions_enabled",
      value: true,
      category: "challenges",
      description: "Allow users to submit challenge attempts",
      isProtected: false,
    },
    {
      key: "challenges.auto_publish",
      value: false,
      category: "challenges",
      description: "Automatically publish approved challenges",
      isProtected: false,
    },
    {
      key: "challenges.max_duration_minutes",
      value: 180,
      category: "challenges",
      description: "Maximum allowed duration for a single challenge in minutes",
      isProtected: false,
    },
    {
      key: "challenges.max_questions",
      value: 100,
      category: "challenges",
      description: "Maximum number of questions allowed per challenge",
      isProtected: false,
    },
    {
      key: "challenges.negative_marking_enabled",
      value: true,
      category: "challenges",
      description: "Enable negative marking support for challenges",
      isProtected: false,
    },
    // Moderation
    {
      key: "moderation.enabled",
      value: true,
      category: "moderation",
      description: "Enable the content moderation system",
      isProtected: false,
    },
    {
      key: "moderation.auto_flag_enabled",
      value: true,
      category: "moderation",
      description: "Automatically flag content based on report thresholds",
      isProtected: false,
    },
    {
      key: "moderation.require_review",
      value: true,
      category: "moderation",
      description: "Require moderator review before content is published",
      isProtected: false,
    },
    {
      key: "moderation.max_reports_before_flag",
      value: 3,
      category: "moderation",
      description: "Number of reports required before content is auto-flagged",
      isProtected: false,
    },
    // Auth
    {
      key: "auth.registration_enabled",
      value: true,
      category: "auth",
      description: "Allow new user registrations",
      isProtected: false,
    },
    {
      key: "auth.google_oauth_enabled",
      value: true,
      category: "auth",
      description: "Enable Google OAuth login/registration",
      isProtected: false,
    },
    {
      key: "auth.max_login_attempts",
      value: 5,
      category: "auth",
      description: "Maximum failed login attempts before temporary lockout",
      isProtected: false,
    },
    {
      key: "auth.onboarding_required",
      value: true,
      category: "auth",
      description: "Require new users to complete the onboarding flow",
      isProtected: false,
    },
    // Analytics
    {
      key: "analytics.tracking_enabled",
      value: true,
      category: "analytics",
      description: "Enable platform analytics tracking",
      isProtected: false,
    },
    {
      key: "analytics.daily_aggregation_enabled",
      value: true,
      category: "analytics",
      description: "Enable daily analytics aggregation",
      isProtected: false,
    },
    {
      key: "analytics.leaderboard_visible",
      value: true,
      category: "analytics",
      description: "Show leaderboard rankings to all users",
      isProtected: false,
    },
    // System (Protected)
    {
      key: "system.maintenance_mode",
      value: false,
      category: "system",
      description: "Enable maintenance mode",
      isProtected: true,
    },
    {
      key: "system.maintenance_message",
      value: "QuizArena is currently undergoing scheduled maintenance. We'll be back shortly.",
      category: "system",
      description: "Message displayed during maintenance",
      isProtected: true,
    },
    {
      key: "system.debug_mode",
      value: false,
      category: "system",
      description: "Enable debug mode for enhanced logging",
      isProtected: true,
    },
    {
      key: "system.max_concurrent_users",
      value: 10000,
      category: "system",
      description: "Maximum concurrent user sessions",
      isProtected: true,
    },
  ];

  let settingsCreated = 0;
  for (const setting of defaultSettings) {
    const existing = await prisma.platformSetting.findUnique({
      where: { key: setting.key },
    });
    if (!existing) {
      await prisma.platformSetting.create({
        data: {
          key: setting.key,
          value: setting.value,
          category: setting.category,
          description: setting.description,
          isProtected: setting.isProtected,
        },
      });
      settingsCreated++;
    }
  }
  console.log(
    `Platform settings seeded: ${settingsCreated} created, ${defaultSettings.length - settingsCreated} already existed`
  );

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
