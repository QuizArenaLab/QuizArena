import { PrismaClient } from "../src/generated/prisma";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  // Create admin user from environment variables
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

  const questions = await Promise.all([
    prisma.question.create({
      data: {
        question: "What is the capital of India?",
        optionA: "Mumbai",
        optionB: "New Delhi",
        optionC: "Kolkata",
        optionD: "Chennai",
        correctOption: "B",
        explanation: "New Delhi is the capital of India since 1911.",
        subject: "General Knowledge",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "Which planet is known as the Red Planet?",
        optionA: "Venus",
        optionB: "Mars",
        optionC: "Jupiter",
        optionD: "Saturn",
        correctOption: "B",
        explanation: "Mars appears red due to iron oxide on its surface.",
        subject: "Science",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "What is the largest mammal in the world?",
        optionA: "African Elephant",
        optionB: "Blue Whale",
        optionC: "Giraffe",
        optionD: "Polar Bear",
        correctOption: "B",
        explanation: "Blue whales can grow up to 100 feet in length.",
        subject: "General Knowledge",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "In which year did India gain independence?",
        optionA: "1945",
        optionB: "1946",
        optionC: "1947",
        optionD: "1948",
        correctOption: "C",
        explanation: "India gained independence on August 15, 1947.",
        subject: "History",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "What is the chemical symbol for gold?",
        optionA: "Ag",
        optionB: "Au",
        optionC: "Fe",
        optionD: "Cu",
        correctOption: "B",
        explanation: "Au comes from the Latin word 'aurum' meaning gold.",
        subject: "Chemistry",
        difficulty: "MEDIUM",
      },
    }),
    prisma.question.create({
      data: {
        question: "Which is the longest river in India?",
        optionA: "Yamuna",
        optionB: "Ganga",
        optionC: "Brahmaputra",
        optionD: "Godavari",
        correctOption: "B",
        explanation: "Ganga is the longest river in India at 2,525 km.",
        subject: "Geography",
        difficulty: "MEDIUM",
      },
    }),
    prisma.question.create({
      data: {
        question: "Who wrote the Indian national anthem?",
        optionA: "Bankim Chandra Chatterjee",
        optionB: "Rabindranath Tagore",
        optionC: "Mahatma Gandhi",
        optionD: "Jawaharlal Nehru",
        correctOption: "B",
        explanation: "Jana Gana Mana was written by Rabindranath Tagore.",
        subject: "General Knowledge",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "What is the speed of light in vacuum?",
        optionA: "3 x 10^6 m/s",
        optionB: "3 x 10^8 m/s",
        optionC: "3 x 10^4 m/s",
        optionD: "3 x 10^2 m/s",
        correctOption: "B",
        explanation: "Speed of light is approximately 299,792,458 m/s.",
        subject: "Physics",
        difficulty: "MEDIUM",
      },
    }),
    prisma.question.create({
      data: {
        question: "Which state is known as the 'Rice Bowl' of India?",
        optionA: "Punjab",
        optionB: "West Bengal",
        optionC: "Andhra Pradesh",
        optionD: "Tamil Nadu",
        correctOption: "C",
        explanation: "Andhra Pradesh produces the most rice in India.",
        subject: "Geography",
        difficulty: "MEDIUM",
      },
    }),
    prisma.question.create({
      data: {
        question: "What is the square root of 144?",
        optionA: "10",
        optionB: "11",
        optionC: "12",
        optionD: "13",
        correctOption: "C",
        explanation: "12 x 12 = 144, so √144 = 12.",
        subject: "Mathematics",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "Which is the smallest prime number?",
        optionA: "0",
        optionB: "1",
        optionC: "2",
        optionD: "3",
        correctOption: "C",
        explanation: "2 is the smallest and only even prime number.",
        subject: "Mathematics",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "Who is known as the Father of the Indian Constitution?",
        optionA: "Mahatma Gandhi",
        optionB: "Jawaharlal Nehru",
        optionC: "Dr. B.R. Ambedkar",
        optionD: " Sardar Patel",
        correctOption: "C",
        explanation: "Dr. B.R. Ambedkar was the chief architect of the Constitution.",
        subject: "History",
        difficulty: "MEDIUM",
      },
    }),
    prisma.question.create({
      data: {
        question: "What is the atomic number of Carbon?",
        optionA: "4",
        optionB: "6",
        optionC: "8",
        optionD: "12",
        correctOption: "B",
        explanation: "Carbon has 6 protons, hence atomic number 6.",
        subject: "Chemistry",
        difficulty: "MEDIUM",
      },
    }),
    prisma.question.create({
      data: {
        question: "Which mountain range separates India from Nepal?",
        optionA: "Aravalli",
        optionB: "Vindhya",
        optionC: "Himalayas",
        optionD: "Satpura",
        correctOption: "C",
        explanation: "The Himalayas form a natural border between India and Nepal.",
        subject: "Geography",
        difficulty: "EASY",
      },
    }),
    prisma.question.create({
      data: {
        question: "What is the national bird of India?",
        optionA: "Peacock",
        optionB: "Parrot",
        optionC: "Pigeon",
        optionD: "Swan",
        correctOption: "A",
        explanation: "The Indian Peacock was declared the national bird in 1963.",
        subject: "General Knowledge",
        difficulty: "EASY",
      },
    }),
  ]);

  const challenge = await prisma.challenge.create({
    data: {
      title: "Daily Challenge - General Knowledge",
      slug: "daily-challenge-general",
      description: "Test your general knowledge with 15 questions",
      examCategory: "SSC",
      difficulty: "MEDIUM",
      totalQuestions: questions.length,
      durationInMinutes: 20,
      isPublished: true,
      challengeDate: new Date(),
    },
  });

  await Promise.all(
    questions.map((q, index) =>
      prisma.challengeQuestion.create({
        data: {
          challengeId: challenge.id,
          questionId: q.id,
          order: index + 1,
        },
      })
    )
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
