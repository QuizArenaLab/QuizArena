import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({where:{email:'quizarenadev@gmail.com'}});
  console.log("Admin:", admin);
  
  const superAdmin = await prisma.user.findUnique({where:{email:'quizarena2026@gmail.com'}});
  console.log("Super Admin:", superAdmin);
}

main().finally(() => prisma.$disconnect());
